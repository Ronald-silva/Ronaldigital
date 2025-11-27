import React from 'react';
import { LogoRounded, LogoRoundedMore, LogoCircle, LogoModern, LogoTech } from '@/components/ui/logo-variants';
import { Logo } from '@/components/ui/logo';

export function LogoDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Opções de Logo - RonalDigital</h1>
          <p className="text-muted-foreground">
            Comparação de diferentes estilos para sua logo
          </p>
        </div>

        {/* Logo Atual */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Logo Atual (Quadrada)</h2>
          <div className="flex items-center gap-8 p-6 bg-muted/30 rounded-lg">
            <Logo variant="icon-only" size="sm" className="rounded-none" />
            <Logo variant="icon-only" size="md" className="rounded-none" />
            <Logo variant="icon-only" size="lg" className="rounded-none" />
            <Logo variant="icon-only" size="xl" className="rounded-none" />
          </div>
        </section>

        {/* Opção 1: Recomendada */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-primary">
              Opção 1: Cantos Arredondados (RECOMENDADA) ⭐
            </h2>
            <p className="text-sm text-muted-foreground">
              Ideal para tech/IA - Profissional e moderno
            </p>
          </div>
          <div className="flex items-center gap-8 p-6 bg-muted/30 rounded-lg">
            <LogoRounded size="sm" />
            <LogoRounded size="md" />
            <LogoRounded size="lg" />
            <LogoRounded size="xl" />
          </div>
        </section>

        {/* Opção 2 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Opção 2: Mais Arredondada</h2>
            <p className="text-sm text-muted-foreground">
              Mais suave, boa para apps mobile
            </p>
          </div>
          <div className="flex items-center gap-8 p-6 bg-muted/30 rounded-lg">
            <LogoRoundedMore size="sm" />
            <LogoRoundedMore size="md" />
            <LogoRoundedMore size="lg" />
            <LogoRoundedMore size="xl" />
          </div>
        </section>

        {/* Opção 3 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Opção 3: Circular</h2>
            <p className="text-sm text-muted-foreground">
              Para perfis e avatares - pode cortar conteúdo
            </p>
          </div>
          <div className="flex items-center gap-8 p-6 bg-muted/30 rounded-lg">
            <LogoCircle size="sm" />
            <LogoCircle size="md" />
            <LogoCircle size="lg" />
            <LogoCircle size="xl" />
          </div>
        </section>

        {/* Opção 4 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Opção 4: Moderna com Borda</h2>
            <p className="text-sm text-muted-foreground">
              Estilo glassmorphism - muito atual
            </p>
          </div>
          <div className="flex items-center gap-8 p-6 bg-muted/30 rounded-lg">
            <LogoModern size="sm" />
            <LogoModern size="md" />
            <LogoModern size="lg" />
            <LogoModern size="xl" />
          </div>
        </section>

        {/* Opção 5 */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Opção 5: Tech com Gradiente</h2>
            <p className="text-sm text-muted-foreground">
              Destaque sutil com cor da marca
            </p>
          </div>
          <div className="flex items-center gap-8 p-6 bg-muted/30 rounded-lg">
            <LogoTech size="sm" />
            <LogoTech size="md" />
            <LogoTech size="lg" />
            <LogoTech size="xl" />
          </div>
        </section>

        {/* Comparação em contextos */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Em Contexto (Header)</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
              <LogoRounded size="lg" />
              <div className="text-sm text-muted-foreground">Navegação</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
              <LogoModern size="lg" />
              <div className="text-sm text-muted-foreground">Navegação</div>
            </div>
          </div>
        </section>

        {/* Recomendação */}
        <section className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-primary mb-2">💡 Recomendação Final</h3>
          <p className="text-sm">
            Para seu nicho (desenvolvimento web/IA), recomendo a <strong>Opção 1: Cantos Arredondados</strong>.
            É o padrão atual das principais empresas tech, transmite profissionalismo moderno e funciona 
            perfeitamente em todos os tamanhos e contextos.
          </p>
        </section>
      </div>
    </div>
  );
}