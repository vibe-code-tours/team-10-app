import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">ShopMM</div>
            <p className="footer-desc">
              မြန်မာနိုင်ငံ၏ ယုံကြည်စိတ်ချရသော အွန်လိုင်းစျေးဝယ်စနစ်။
              ဆိုင်ပေါင်းစုံမှ ပစ္စည်းများကို လုံခြုံစွာဝယ်ယူနိုင်ပါသည်။
            </p>
          </div>

          <div>
            <h4 className="footer-title">ဝယ်သူများ</h4>
            <ul className="footer-links">
              <li>
                <Link href="/products">ပစ္စည်းရှာရန်</Link>
              </li>
              <li>
                <Link href="/account/orders">မှာယူမှုများ</Link>
              </li>
              <li>
                <Link href="/account/addresses">လိပ်စာများ</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">ရောင်းသူများ</h4>
            <ul className="footer-links">
              <li>
                <Link href="/seller/dashboard">ဆိုင်စီမံခန့်ခွဲရန်</Link>
              </li>
              <li>
                <Link href="/seller/products">ပစ္စည်းတင်ရန်</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">အထောက်အကူ</h4>
            <ul className="footer-links">
              <li>
                <Link href="/help">အကူအညီ</Link>
              </li>
              <li>
                <Link href="/privacy">ကိုယ်ရေးလုံခြုံမှု</Link>
              </li>
              <li>
                <Link href="/terms">စည်းမျဉ်းစည်းကမ်း</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          © {currentYear} ShopMM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
