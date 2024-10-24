'use server';

import prisma from "@/lib/prisma";

export const getProductBySlug = async (slug: string) => {
    try {
        const product = await prisma.product.findUnique({
            include: {
                images: {
                    select: {
                        url: true,
                        id: true
                    }
                }
            },
            where: {
                slug,
            }
        })

        if (!product) return null



        return ({
            ...product,
            productImages: product.images,
            images: product.images.map(image => image.url)
        })
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener producto por slug')
    }
}