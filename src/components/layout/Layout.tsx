import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}

export default Layout;