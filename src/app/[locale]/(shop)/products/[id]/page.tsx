import { createPublicClient } from "@/lib/supabase/public";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import AddToCartButton from "@/components/shop/AddToCartButton";
import ReviewForm from "@/components/shop/ReviewForm";

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = createPublicClient();
  const t = await getTranslations("ProductDetail");

  const [{ data: product }, { data: reviews }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!product) notFound();

  return (
    <div className="container section" id="product-detail">
      <nav
        style={{
          fontSize: "var(--font-size-sm)",
          color: "var(--color-text-tertiary)",
          marginBottom: "var(--space-xl)",
        }}
      >
        <Link href="/" style={{ color: "var(--color-text-tertiary)" }}>
          {t("home")}
        </Link>
        {" / "}
        <Link href="/products" style={{ color: "var(--color-text-tertiary)" }}>
          {t("productsBreadcrumb")}
        </Link>
        {" / "}
        {product.category && (
          <>
            <Link
              href={`/?category=${product.category}`}
              style={{
                color: "var(--color-text-tertiary)",
                textTransform: "capitalize",
              }}
            >
              {product.category}
            </Link>
            {" / "}
          </>
        )}
        <span style={{ color: "var(--color-text)" }}>{product.title}</span>
      </nav>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-2xl)",
        }}
      >
        <div>
          <div
            className="card"
            style={{
              position: "relative",
              aspectRatio: "1",
              overflow: "hidden",
              marginBottom: "var(--space-md)",
            }}
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                id="product-main-image"
                priority
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--color-bg-secondary)",
                  fontSize: "4rem",
                  color: "var(--color-text-tertiary)",
                }}
              >
                ☐
              </div>
            )}
          </div>
        </div>

        <div>
          <h1
            style={{
              fontSize: "var(--font-size-2xl)",
              fontWeight: 600,
              letterSpacing: "-0.3px",
              marginBottom: "var(--space-md)",
            }}
          >
            {product.title}
          </h1>

          <div
            style={{
              fontSize: "var(--font-size-3xl)",
              fontWeight: 700,
              marginBottom: "var(--space-lg)",
            }}
          >
            ${Number(product.price).toFixed(2)}
          </div>

          <div style={{ marginBottom: "var(--space-lg)" }}>
            {product.stock > 0 ? (
              <span
                className="badge badge-success"
                style={{
                  backgroundColor: "rgba(45,125,70,0.1)",
                  color: "var(--color-success)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                {t("inStock", { count: product.stock })}
              </span>
            ) : (
              <span
                className="badge badge-danger"
                style={{
                  backgroundColor: "rgba(211,47,47,0.1)",
                  color: "var(--color-danger)",
                  padding: "4px 8px",
                  borderRadius: "4px",
                }}
              >
                {t("outOfStock")}
              </span>
            )}
          </div>

          {product.stock > 0 && <AddToCartButton product={product} />}

          {product.description && (
            <div
              style={{
                marginTop: "var(--space-xl)",
                paddingTop: "var(--space-xl)",
                borderTop: "1px solid var(--color-border-light)",
              }}
            >
              <h3
                style={{
                  fontSize: "var(--font-size-base)",
                  fontWeight: 500,
                  marginBottom: "var(--space-md)",
                }}
              >
                {t("description")}
              </h3>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div
        style={{
          marginTop: "var(--space-3xl)",
          borderTop: "1px solid var(--color-border)",
          paddingTop: "var(--space-2xl)",
        }}
      >
        <h2
          style={{
            fontSize: "var(--font-size-xl)",
            fontWeight: 600,
            marginBottom: "var(--space-lg)",
          }}
        >
          {t("reviewsTitle")}
        </h2>

        <div
          style={
            {
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "var(--space-2xl)",
              "@media (minWidth: 768px)": { gridTemplateColumns: "2fr 1fr" },
            } as React.CSSProperties
          }
        >
          {/* Reviews List */}
          <div>
            {reviews && reviews.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-lg)",
                }}
              >
                {reviews.map(
                  (review: {
                    id: string;
                    rating: number;
                    comment: string;
                    created_at: string;
                    users?: { full_name: string };
                  }) => (
                    <div
                      key={review.id}
                      style={{
                        padding: "var(--space-md)",
                        background: "var(--color-surface)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--color-border-light)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "var(--space-sm)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            color: "#FACC15",
                          }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill={i < review.rating ? "currentColor" : "none"}
                              stroke={
                                i < review.rating ? "none" : "currentColor"
                              }
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                          ))}
                        </div>
                        <span
                          style={{
                            fontSize: "var(--font-size-xs)",
                            color: "var(--color-text-tertiary)",
                          }}
                        >
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p
                          style={{
                            fontSize: "var(--font-size-sm)",
                            color: "var(--color-text-secondary)",
                            lineHeight: 1.6,
                          }}
                        >
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p
                style={{
                  color: "var(--color-text-tertiary)",
                  fontStyle: "italic",
                }}
              >
                {t("noReviews")}
              </p>
            )}
          </div>

          {/* Review Form */}
          <div>
            <ReviewForm productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
