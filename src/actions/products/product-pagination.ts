'use server';

import prisma from "@/lib/prisma";
import { Gender } from "@prisma/client";


interface PaginationOptions {
    page?: number;
    take?: number;
    gender?: Gender;
}

export const getPaginatedProductsWithImages = async ({
    page = 1,
    take = 12,
    gender
}: PaginationOptions) => {

    if (isNaN(Number(page))) page = 1
    if (page < 1) page = 1
    if (isNaN(Number(take))) take = 12
    if (take < 1) take = 12

    try {
        const products = await prisma.product.findMany({
            take: take,
            skip: (page - 1) * take,
            include: {
                images: {
                    take: 2,
                    select: {
                        url: true
                    }
                }
            },
            where: {
                gender: gender
            }
        })

        const totalCount = await prisma.product.count({
            where: {
                gender: gender
            }
        })
        const totalPages = Math.ceil(totalCount / take)

        return {
            currentPage: page,
            totalPages,
            products: products.map(product => ({
                ...product,
                images: product.images.map(image => image.url)
            }))
        }
    } catch (error) {
        console.log(error)
        throw new Error('No se cargaron los products')
    }
}