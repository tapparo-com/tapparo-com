import { MenuItem } from "./MenuItem";

type MenuItemType = {
  _id: string;
  title: string;
  description?: string;
  pricingType: string;
  price?: number;
  priceVariants?: { _key: string; label: string; price: number }[];
  dietaryTags?: string[];
  image?: any;
};

type Props = {
  title: string;
  description?: string;
  items: MenuItemType[];
};

export function MenuSection({ title, description, items }: Props) {
  return (
    <section className="py-16 first:pt-0">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && (
        <p className="mt-2 text-muted">{description}</p>
      )}
      <div className="mt-8 space-y-8">
        {items.map((item) => (
          <MenuItem key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
