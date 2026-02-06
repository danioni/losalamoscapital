# Los Álamos Capital

> *Donde hay álamos, hay raíces.*

Track record público de inversiones de **Los Álamos Capital SpA**. Un family office chileno enfocado en transparencia absoluta y visión de largo plazo.

## Filosofía

Los álamos tienen raíces profundas — se sostienen en las tormentas y crecen alto cuando les das tiempo. Esa es nuestra filosofía de inversión:

- **Transparencia total**: Todo está visible públicamente
- **Largo plazo**: Horizonte de 5+ años
- **Acumular, no vender**: Buy, Borrow, Die
- **Simplicidad**: Pocos activos, alta convicción

## Track Record Público

Visitá [losalamoscapital.com](https://losalamoscapital.com) para ver:

- Rendimiento actualizado del portafolio
- Composición de activos
- Historial de decisiones de inversión
- Snapshots mensuales verificables

## Cómo Funciona la Transparencia

### Precios en Tiempo Real

Los precios de los activos se obtienen de fuentes públicas verificables:

| Activo | Fuente | Frecuencia |
|--------|--------|------------|
| Bitcoin (BTC) | CoinGecko API | Tiempo real |
| Acciones/ETFs | Yahoo Finance | Tiempo real |
| Peso Chileno | Banco Central | Diario |

### Snapshots Mensuales

Cada mes se genera un snapshot inmutable que incluye:

- Valor total del portafolio en USD y CLP
- Cantidad exacta de cada activo
- Precio de cada activo al momento del snapshot
- Hash verificable del estado

### Registro de Decisiones

Cada decisión de inversión (compra, venta, rebalanceo) queda registrada con:

- Fecha y hora
- Activo afectado
- Cantidad y precio
- Razón de la decisión
- Impacto en el portafolio

## Stack Técnico

- **Frontend**: Next.js 16 + React 19
- **Base de Datos**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Precios**: APIs públicas (CoinGecko, Yahoo Finance)

## Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx          # Landing pública con track record
│   ├── admin/            # Panel de administración (privado)
│   ├── familia/          # Contenido familiar (privado)
│   └── api/              # Endpoints de datos
├── components/
│   ├── public/           # Componentes de la landing
│   ├── admin/            # Componentes del admin
│   ├── ui/               # Componentes UI reutilizables
│   └── layout/           # Layouts y estructuras
└── lib/
    ├── supabase/         # Cliente y queries
    └── styles/           # Sistema de colores
```

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Variables de entorno
cp .env.example .env.local

# Correr en desarrollo
npm run dev
```

## Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

## Licencia

Este proyecto es privado. El código fuente no está disponible para uso público.

---

**Los Álamos Capital SpA** · Chile · 2025

*"Las vueltas son las que dejan"*
