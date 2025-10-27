import { Instagram, Mail, Phone} from "lucide-react";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#039BE5] text-white">
      <div className=" mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Left Section (Logo Only) */}
        <div>
          {/* Ganti src dengan logo kamu */}
          <img
            src={logo}
            alt="Akademika TKA Logo"
            className="w-45 h-auto"
          />
        </div>

        {/* Right Section */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16">
          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-2">Our Social Media :</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <Instagram size={16} /> @akademika.tka
              </li>
              {/* <li className="flex items-center gap-2">
                <Tiktok size={16} /> @akademika.tka
              </li> */}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-2">Our Contact :</h3>
            <ul className="space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} /> 085784073063
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} /> akademtika@gmail.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#015C78] text-center text-xs py-2">
        © 2025 AkademikaTKA. All rights reserved.
      </div>
    </footer>
  );
}
