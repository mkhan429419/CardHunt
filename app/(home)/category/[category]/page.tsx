import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { getFlashcardCollectionsByCategoryName } from "@/lib/server-actions";
import Image from "next/image";
import Link from "next/link";

interface IParams {
  category: string;
}

const CategoryPage: React.FC<{ params: IParams }> = async ({ params }) => {
  const capitalizedCategory =
    params.category.charAt(0).toUpperCase() + params.category.slice(1);

  const flashcardCollections = await getFlashcardCollectionsByCategoryName(capitalizedCategory);

  return (
    <div className="md:w-3/5 mx-auto pt-10 px-6 md:px-0">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{capitalizedCategory}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-semibold pt-10">{capitalizedCategory}</h1>
      <p className="text-gray-500 pt-2">
        Check out what&apos;s going on in the {capitalizedCategory} category! Discover new flashcard collections.
      </p>

      <div className="pt-10 space-y-4">
        {flashcardCollections.map((collection: any) => (
          <Link
            href={`/flashcard/${collection.slug}`}
            key={collection.id}
            className="flex gap-x-4 items-center p-2 rounded-md border"
          >
            <Image
              src={collection.user.image || "/default-profile.png"}
              alt="user profile"
              width={1000}
              height={1000}
              className="w-16 h-16 md:w-20 md:h-20 rounded-md cursor-pointer"
            />
            <div>
              <h2 className="font-semibold text-lg">{collection.name}</h2>
              <p className="text-gray-500 text-sm md:py-2">{collection.headline}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
