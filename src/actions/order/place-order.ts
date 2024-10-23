/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}

export const placeOrder = async (productsIds: ProductToOrder[], address: Address) => {
    const session = await auth();
    const userId = session?.user.id

    // verificar el usuario
    if (!userId) {
        return {
            ok: false,
            message: 'No hay sessión de usuario'
        }
    }

    // obtener info de los productos
    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productsIds.map(prod => prod.productId)
            }
        }
    })

    // calcular los encabezados
    const itemsInOrder = productsIds.reduce((count, item) => count + item.quantity, 0)

    const { subTotal, tax, total } = productsIds.reduce((totals, item) => {

        const productQuantity = item.quantity;
        const product = products.find(product => product.id === item.productId)

        if (!product) throw new Error(` ${item.productId} no existe`);

        const subTotal = product.price * productQuantity

        totals.subTotal += subTotal
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals
    }, { subTotal: 0, tax: 0, total: 0 })


    // transaction
    try {
        const prismaTx = await prisma.$transaction(async (tx) => {
            // 1. Actualizar el stock de los productos
            const updatedProductsPromises = products.map((product) => {
                const productQuantity = productsIds.filter(
                    p => p.productId === product.id
                ).reduce((acc, item) => item.quantity + acc, 0)

                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`)
                }
                return tx.product.update({
                    where: {
                        id: product.id
                    },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })

            });

            const updatedProducts = await Promise.all(updatedProductsPromises);

            // verificar valores negativos en el stock
            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`)
                }
            })


            // 2. crear la orden - Maestro - Detalle
            const order = await tx.order.create({
                data: {
                    userId,
                    itemsInOrder,
                    subTotal,
                    tax,
                    total,
                    orderItems: {
                        createMany: {
                            data: productsIds.map(p => ({
                                quantity: p.quantity,
                                size: p.size,
                                productId: p.productId,
                                price: products.find(product => product.id === p.productId)?.price ?? 0
                            }))
                        }
                    }
                }
            })

            // 3. Crear direccion de la orden
            const orderAddress = await tx.orderAddress.create({
                data: {
                    firstName: address.firstName,
                    lastName: address.lastName,
                    address: address.address,
                    address2: address.address2,
                    city: address.city,
                    phone: address.phone,
                    postalCode: address.postalCode,
                    orderId: order.id,
                    countryId: address.country
                }
            })


            return {
                updatedProducts: updatedProducts,
                order: order,
                orderAddress: orderAddress
            }

        })

        return {
            ok: true,
            order: prismaTx.order,
            prismaTx
        }

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }

}