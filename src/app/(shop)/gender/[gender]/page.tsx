export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";
// import { notFound } from "next/navigation";



interface Props {
  params: {
    gender: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    gender: gender as Gender,
  });

  if (products.length === 0) {
    redirect(`/gender/${gender}`);
  }

  // if(id === 'kids'){
  //   notFound();
  // }

  const labels: Record<string, string> = {
    men: "hombres",
    women: "mujeres",
    kid: "niños",
    unisex: "todos",
  };

  return (
    <>
      <Title
        title={`Artículos para ${labels[gender]}`}
        subtitle={`Todos los productos`}
        className=" mb-2"
      />
      <ProductGrid products={products} />
      <Pagination totalPages={totalPages} />
    </>
  );
}
