import { Droplets, Sun, Leaf, Home, Shield } from "lucide-react";

interface ProductCareInfoProps {
  product: {
    careInstructions?: string;
    lightRequirements?: string;
    wateringInfo?: string;
    careLevel?: string;
    suitableRoom?: string;
    petSafety?: string;
    plantSize?: string;
    difficultyLevel?: string;
  };
}

const CARE_ICONS: Record<string, React.ReactNode> = {
  light: <Sun className="h-5 w-5" />,
  water: <Droplets className="h-5 w-5" />,
  care: <Leaf className="h-5 w-5" />,
  room: <Home className="h-5 w-5" />,
  pet: <Shield className="h-5 w-5" />,
};

export function ProductCareInfo({ product }: ProductCareInfoProps) {
  const careItems = [
    { key: "light", label: "Light", value: product.lightRequirements },
    { key: "water", label: "Watering", value: product.wateringInfo },
    { key: "care", label: "Care Level", value: product.careLevel || product.difficultyLevel },
    { key: "room", label: "Suitable Room", value: product.suitableRoom },
    { key: "pet", label: "Pet Safety", value: product.petSafety },
  ].filter((item) => item.value);

  if (careItems.length === 0 && !product.careInstructions && !product.plantSize) {
    return null;
  }

  return (
    <section className="mt-12 rounded-xl border border-border bg-surface p-6">
      <h2 className="font-heading text-2xl text-text">Plant Care</h2>

      {product.plantSize && (
        <p className="mt-2 text-sm text-text-muted">Size: {product.plantSize}</p>
      )}

      {careItems.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careItems.map((item) => (
            <div key={item.key} className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                {CARE_ICONS[item.key]}
              </div>
              <div>
                <p className="text-sm font-medium text-text">{item.label}</p>
                <p className="text-sm text-text-muted">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {product.careInstructions && (
        <div className="mt-6 border-t border-border pt-6">
          <h3 className="font-medium text-text">Care Instructions</h3>
          <p className="mt-2 text-sm leading-relaxed text-text-muted whitespace-pre-line">
            {product.careInstructions}
          </p>
        </div>
      )}
    </section>
  );
}
