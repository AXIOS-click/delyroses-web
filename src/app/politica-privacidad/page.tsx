import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildJuiceMetadata, toAbsoluteUrl } from "@/lib/juice-seo";
import { siteConfig } from "@/lib/site";

const privacyPolicyPath = "/politica-privacidad";
const lastUpdated = "18 de julio de 2026";

export const metadata = buildJuiceMetadata({
  title: "Política de privacidad",
  description:
    "Política de privacidad de Dely Roses sobre datos personales, pedidos, cookies, tecnologías similares y Reseñas de usuarios en Google.",
  path: privacyPolicyPath,
  keywords: ["política de privacidad", "datos personales", "cookies", "reseñas de usuarios en Google"],
});

const privacySections = [
  {
    title: "1. Responsable y alcance",
    paragraphs: [
      `${siteConfig.name} trata datos personales relacionados con la navegación del sitio, solicitudes de información, pedidos, entregas, pagos, atención al cliente y comunicaciones posteriores a la compra. Esta política aplica al sitio web, al checkout, a las páginas de confirmación y a los canales oficiales vinculados a la operación comercial de Dely Roses.`,
      "Al utilizar el sitio, solicitar información o realizar un pedido, el usuario reconoce que sus datos pueden ser tratados conforme a esta Política de Privacidad y a las finalidades aquí descritas.",
    ],
  },
  {
    title: "2. Datos que podemos recopilar",
    paragraphs: [
      "Podemos recopilar datos de identificación y contacto, tales como nombre, correo electrónico, teléfono o WhatsApp; datos de entrega, como dirección, sector, ciudad, provincia, referencias y notas del pedido; datos transaccionales, como número de pedido, productos adquiridos, cantidades, valores, fecha de creación del pedido y estado operativo de la compra; y datos técnicos básicos relacionados con el uso del sitio.",
      "No solicitamos información sensible de salud, datos financieros completos de tarjetas ni información que no sea necesaria para preparar, coordinar o atender los pedidos florales.",
    ],
  },
  {
    title: "3. Finalidades del tratamiento",
    paragraphs: [
      "Los datos personales se utilizan para recibir pedidos, validar información del cliente, calcular costos de entrega, preparar arreglos florales, coordinar despachos, emitir confirmaciones, atender consultas, gestionar comprobantes de pago, resolver incidencias y mantener registros comerciales razonables.",
      "También podemos utilizar la información para mejorar la experiencia del sitio, medir el desempeño de campañas, mantener la seguridad operativa, prevenir abusos y cumplir obligaciones legales o contractuales aplicables.",
    ],
  },
  {
    title: "4. Reseñas de usuarios en Google",
    paragraphs: [
      "Dely Roses puede participar en el programa Reseñas de usuarios en Google. Después de una compra, Google puede mostrar un módulo opcional de consentimiento para que el cliente decida si desea recibir una invitación de Google para valorar su experiencia.",
      "Si el módulo se muestra, Google puede recibir información de la transacción necesaria para operar el programa, incluyendo el identificador del comerciante, número de pedido, correo electrónico del cliente, país de entrega y fecha estimada de entrega. Cuando existan identificadores globales de producto válidos, como GTIN, también podrían enviarse datos de producto permitidos por el programa.",
      "La participación del cliente en la encuesta es opcional. Google tratará la información recibida conforme a sus propias políticas, incluida la Política de Privacidad de Google.",
    ],
  },
  {
    title: "5. Cookies, balizas web y tecnologías similares",
    paragraphs: [
      "Terceros, incluido Google, pueden implementar cookies en el navegador del usuario y leerlas, así como utilizar balizas web, píxeles, etiquetas u otras tecnologías similares para recopilar información relacionada con la navegación, la medición del sitio, analítica, rendimiento, seguridad o el programa Reseñas de usuarios en Google.",
      "Estas tecnologías pueden permitir reconocer un navegador, medir interacciones, cargar servicios externos, recordar preferencias, mejorar la seguridad o asociar una transacción con una invitación de reseña cuando el usuario haya aceptado participar en el programa correspondiente.",
    ],
  },
  {
    title: "6. Administración de cookies",
    paragraphs: [
      "El usuario puede administrar, bloquear, limitar o eliminar cookies desde la configuración de su navegador. La mayoría de navegadores permiten revisar cookies almacenadas, impedir cookies de terceros, borrar datos de navegación o configurar avisos antes de aceptar determinadas tecnologías.",
      "El usuario también puede revisar herramientas de privacidad y preferencias de Google disponibles en sus servicios. El bloqueo de ciertas cookies o tecnologías puede afectar el funcionamiento de algunas funciones del sitio o de servicios externos integrados.",
    ],
  },
  {
    title: "7. Compartición de datos con terceros",
    paragraphs: [
      "Podemos compartir datos estrictamente necesarios con proveedores que apoyan la operación del sitio, almacenamiento de pedidos, análisis, infraestructura, atención al cliente, servicios de pago, mensajería, logística o herramientas de Google vinculadas a medición, verificación, reseñas u otros servicios habilitados.",
      "Dely Roses no vende datos personales de clientes. La información se comparte únicamente cuando resulta necesaria para prestar el servicio, cumplir obligaciones, proteger la operación o utilizar herramientas integradas al sitio conforme a sus términos aplicables.",
    ],
  },
  {
    title: "8. Conservación y seguridad",
    paragraphs: [
      "Los datos se conservan durante el tiempo razonablemente necesario para cumplir las finalidades de compra, entrega, atención, registro comercial, prevención de fraude, cumplimiento legal y defensa frente a reclamaciones.",
      "Aplicamos medidas razonables para proteger la información frente a accesos no autorizados, pérdida, alteración o divulgación indebida. Ningún sistema digital puede garantizar seguridad absoluta, por lo que el usuario también debe cuidar la confidencialidad de sus propios canales de comunicación.",
    ],
  },
  {
    title: "9. Derechos del usuario",
    paragraphs: [
      "El usuario puede solicitar acceso, rectificación, actualización o eliminación de sus datos personales cuando corresponda, así como formular consultas relacionadas con el tratamiento de su información. Algunas solicitudes pueden estar sujetas a verificación de identidad y a límites legales, contractuales u operativos.",
      "Cuando los datos sean necesarios para mantener registros de pedidos, cumplir obligaciones o atender reclamaciones, Dely Roses podrá conservar la información mínima necesaria durante el plazo aplicable.",
    ],
  },
  {
    title: "10. Cambios a esta política",
    paragraphs: [
      "Dely Roses puede actualizar esta Política de Privacidad para reflejar cambios legales, técnicos, operativos, comerciales o de servicios externos integrados al sitio. La versión vigente será la publicada en esta página.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  const pageUrl = toAbsoluteUrl(privacyPolicyPath);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Política de privacidad", path: privacyPolicyPath },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "PrivacyPolicy",
            name: "Política de privacidad",
            url: pageUrl,
            inLanguage: "es",
            dateModified: "2026-07-18",
            publisher: {
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
            },
          },
        ]}
      />

      <section className="border-b border-border bg-muted">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Privacidad</p>
          <h1 className="mt-3 max-w-4xl text-foreground">Política de privacidad</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Esta política explica cómo Dely Roses trata datos personales, información de pedidos, cookies, tecnologías similares y datos vinculados al programa Reseñas de usuarios en Google.
          </p>
          <p className="mt-4 text-sm font-bold text-accent">Última actualización: {lastUpdated}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="h-fit rounded-[1.75rem] border border-border bg-card p-6 shadow-sm lg:sticky lg:top-28">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Puntos clave</p>
          <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>Usamos los datos para preparar pedidos, coordinar entregas y atender al cliente.</p>
            <p>Google puede recibir información de transacciones si se muestra el módulo opcional de Reseñas de usuarios en Google.</p>
            <p>El usuario puede administrar cookies desde su navegador y revisar las opciones de privacidad de Google.</p>
            <Link href="/politica-devoluciones" className="inline-flex font-bold text-accent hover:underline">
              Ver política de devoluciones
            </Link>
          </div>
        </aside>

        <article className="space-y-6">
          {privacySections.map((section) => (
            <section key={section.title} className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-bold tracking-[-0.04em] text-foreground">{section.title}</h2>
              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <section className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-foreground">11. Contacto</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>Para consultas de privacidad, el usuario puede contactar a Dely Roses por los canales oficiales publicados en el sitio.</p>
              {siteConfig.whatsappUrl ? (
                <p>
                  WhatsApp: <a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer" className="font-bold text-accent hover:underline">canal oficial de Dely Roses</a>.
                </p>
              ) : null}
              {siteConfig.contactEmail ? (
                <p>
                  Correo electrónico: <a href={`mailto:${siteConfig.contactEmail}`} className="font-bold text-accent hover:underline">{siteConfig.contactEmail}</a>.
                </p>
              ) : null}
            </div>
          </section>
        </article>
      </section>
    </>
  );
}
