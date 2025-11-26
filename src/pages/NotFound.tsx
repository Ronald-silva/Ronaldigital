import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Logo } from "@/components/ui/logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="text-center">
        <div className="mb-8 opacity-50 flex justify-center">
          <Logo size="xl" showText={false} />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Página não encontrada</p>
        <a href="/" className="text-primary hover:text-primary/80 underline">
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
