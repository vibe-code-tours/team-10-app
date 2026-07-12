import Image from "next/image";
import formImg from "@/assets/form_img.png";

interface Props {
  children: React.ReactNode;
}

export function AuthLayout({ children }: Props) {
  return (
    <div className="auth-page">
      <div className="auth-shell card">
        <div className="auth-image-panel">
          <Image
            src={formImg}
            alt=""
            fill
            sizes="(max-width: 900px) 0px, 440px"
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="auth-image-overlay" />
          <div className="auth-image-caption">
            <span className="auth-image-brand">Yoe Yar Zay</span>
            <span className="auth-image-tagline">
              Handmade goods, straight from local makers.
            </span>
          </div>
        </div>
        <div className="auth-form-panel">{children}</div>
      </div>
    </div>
  );
}
