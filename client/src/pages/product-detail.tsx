import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductDetail as ProductDetailComponent } from "@/components/product-detail";
import { Skeleton } from "@/components/ui/skeleton";


interface ProductDetailProps {
  params: {
    productId: string;
  };
}

export default function ProductDetail({ params }: ProductDetailProps) {
  const productId = parseInt(params.productId);
  
  // Fetch product details
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: () => fetch(`/api/products/${productId}`).then(res => res.json()),
  });
  
  // Fetch franchise details if product is loaded
  const { data: franchise } = useQuery({
    queryKey: ['/api/franchises', product?.franchiseId],
    queryFn: () => fetch(`/api/franchises/${product.franchiseId}`).then(res => res.json()),
    enabled: !!product?.franchiseId,
  });
  
  // Fetch category for breadcrumbs if franchise is loaded
  const { data: category } = useQuery({
    queryKey: ['/api/categories', franchise?.categoryId],
    queryFn: () => fetch(`/api/categories/${franchise.categoryId}`).then(res => res.json()),
    enabled: !!franchise?.categoryId,
  });
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Prepare breadcrumb items
  const breadcrumbItems = [];
  
  if (category) {
    breadcrumbItems.push({
      label: category.nameKorean,
      path: `/category/${category.id}`,
      current: false
    });
  }
  
  if (franchise) {
    breadcrumbItems.push({
      label: franchise.name,
      path: `/franchise/${franchise.id}`,
      current: false
    });
  }
  
  breadcrumbItems.push({
    label: productLoading ? "로딩 중..." : product?.name || "제품",
    path: `/product/${productId}`,
    current: true
  });
  
  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      
      <ProductDetailComponent productId={productId} />
    </>
  );
}
