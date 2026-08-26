// Bottom navigation final: 4 icon (Home, Customers, Visits, Pipeline).
// "More" sengaja di-drop di V1 karena belum ada fitur yang butuh laci terpisah.

export const BOTTOM_NAV = [
  { label: "Home", href: "/dashboard", icon: "home" },
  { label: "Customers", href: "/customers", icon: "building" },
  { label: "Visits", href: "/visits", icon: "map-pin" },
  { label: "Kalkulator SPH", href: "/calculator", icon: "calculator" },
  { label: "Pipeline", href: "/pipeline", icon: "target" },
  { label: "Follow Up", href: "/follow-ups", icon: "check-circle" },
] as const;

