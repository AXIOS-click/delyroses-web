---
name: Dely Roses
description: |
  Sistema visual para un ecommerce de rosas y arreglos florales con una estética pastel,
  delicada y romántica. La identidad se apoya en rosas suaves, crema cálido, acentos
  mauve y verde salvia para transmitir ternura, frescura y confianza. La experiencia
  debe sentirse elegante, cercana y fácil de comprar, sin verse infantil ni saturada.

colors:
  primary: "#E8A7B9"        # Rosa pastel principal
  primary-hover: "#D98FA5"
  primary-active: "#C97991"
  on-primary: "#4A2530"

  secondary: "#F6D8E1"      # Rosa pétalo
  secondary-hover: "#F1C5D2"
  secondary-active: "#E8AFC0"

  accent: "#B86B84"         # Rosa mauve para detalles importantes
  accent-soft: "#F9E8ED"
  accent-deep: "#7A3F52"

  ink: "#3B252B"            # Texto principal, vino cacao
  body: "#5E454C"
  mute: "#8C7078"
  ash: "#B99DA6"

  canvas: "#FFF9F7"         # Fondo general crema rosado
  surface-soft: "#FFF1F4"   # Secciones suaves
  surface-card: "#FFFFFF"   # Cards de producto
  surface-rose: "#FCE5EC"   # Bloques destacados
  surface-warm: "#FFF4EA"   # Bloques de promociones
  surface-dark: "#4A2530"   # Hero o footer elegante

  hairline: "rgba(74,37,48,0.12)"
  hairline-strong: "#D9AEBB"

  success: "#7FAF8B"        # Verde salvia
  success-soft: "#EDF7EF"
  warning: "#E6A85C"        # Dorado suave
  warning-soft: "#FFF4DF"
  danger: "#C85D6A"
  danger-soft: "#FCE7EA"

typography:
  display-xl:
    fontFamily: Quicksand
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: -0.02em

  heading-lg:
    fontFamily: Quicksand
    fontSize: 28px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.01em

  heading-md:
    fontFamily: Quicksand
    fontSize: 20px
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: 0

  body-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0

  body-strong:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0

  button-md:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.01em

  caption-md:
    fontFamily: Quicksand
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0.01em

rounded:
  none: 0px
  sm: 8px
  md: 14px
  lg: 24px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px 24px
    height: 48px

  button-primary-active:
    backgroundColor: "{colors.primary-active}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"

  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.accent-deep}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px 24px
    height: 48px

  button-whatsapp:
    backgroundColor: "{colors.success}"
    textColor: "#FFFFFF"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 12px 24px
    height: 48px

  product-card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 16px

  product-card-featured:
    backgroundColor: "{colors.surface-rose}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    rounded: "{rounded.lg}"
    padding: 16px

  product-badge:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent-deep}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.full}"
    padding: 6px 12px

  price-label:
    textColor: "{colors.accent-deep}"
    typography: "{typography.heading-md}"

  text-input:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 48px

  text-input-focused:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    border: "1px solid {colors.primary-active}"
    rounded: "{rounded.md}"

  textarea:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 14px 16px

  hero-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 80px 24px

  hero-highlight-card:
    backgroundColor: "{colors.surface-rose}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: 32px
    border: "1px solid {colors.hairline}"

  promo-ribbon:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.accent-deep}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.full}"
    padding: 8px 16px

  category-pill:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.accent-deep}"
    typography: "{typography.caption-md}"
    rounded: "{rounded.full}"
    padding: 8px 14px

  category-pill-active:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    typography: "{typography.caption-md}"
    rounded: "{rounded.full}"

  checkout-summary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.body}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 24px

  testimonial-card:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px

  nav:
    backgroundColor: "rgba(255,249,247,0.86)"
    textColor: "{colors.ink}"
    borderBottom: "1px solid {colors.hairline}"
    typography: "{typography.body-strong}"
    height: 72px

  footer:
    backgroundColor: "{colors.surface-dark}"
    textColor: "#FFF9F7"
    typography: "{typography.caption-md}"
    rounded: "{rounded.none}"
    padding: 48px 24px
---