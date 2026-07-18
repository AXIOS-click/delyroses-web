import { JsonLd } from "@/components/seo/json-ld";
import { buildBreadcrumbJsonLd, buildJuiceMetadata, productReturnPolicyPath, toAbsoluteUrl } from "@/lib/juice-seo";
import { siteConfig } from "@/lib/site";

export const metadata = buildJuiceMetadata({
  title: "Política de devoluciones y reembolsos",
  description:
    "Política de devoluciones y reembolsos de Dely Roses para flores frescas, arreglos florales personalizados y entregas locales en Quito.",
  path: productReturnPolicyPath,
  keywords: ["política de devoluciones", "política de reembolsos", "flores frescas", "arreglos florales personalizados"],
});

const lastUpdated = "18 de julio de 2026";

const policySections = [
  {
    title: "1. Objeto, alcance y aceptación expresa",
    paragraphs: [
      `La presente Política de Devoluciones y Reembolsos regula, con carácter obligatorio, las condiciones aplicables a toda compra, encargo, reserva, preparación, despacho y entrega de productos florales comercializados por ${siteConfig.name}, incluyendo, sin limitarse a ello, arreglos florales, ramos, bouquets, canastas, bases decorativas, tarjetas, complementos y cualquier otro producto elaborado, armado o coordinado por solicitud del cliente.`,
      "Al realizar una compra, confirmar un pedido, efectuar un pago, solicitar la preparación de un arreglo o aceptar la coordinación de entrega, el cliente declara haber leído, entendido y aceptado íntegramente esta política. La aceptación de esta política constituye una condición esencial para la prestación del servicio, debido a la naturaleza perecedera, personalizada y logística de los productos ofrecidos.",
      "Esta política aplica a todos los pedidos realizados por medios digitales, formularios web, WhatsApp, redes sociales, comunicación directa, enlaces de pago, transferencia bancaria o cualquier otro canal habilitado por Dely Roses.",
    ],
  },
  {
    title: "2. Naturaleza perecedera y personalizada de los productos",
    paragraphs: [
      "Los productos comercializados por Dely Roses son bienes perecederos, elaborados principalmente con flores frescas, follajes, bases, empaques, accesorios y elementos decorativos sujetos a disponibilidad, temporada, manipulación artesanal, condiciones ambientales, traslado y tiempos de entrega.",
      "Adicionalmente, cada arreglo floral puede implicar una preparación individualizada conforme al diseño elegido, colores solicitados, ocasión, mensaje, horario, dirección de entrega y preferencias comunicadas por el cliente. Por esta razón, una vez confirmado el pedido, las flores y materiales pueden ser reservados, cortados, hidratados, acondicionados, armados o destinados específicamente a dicho pedido.",
      "En virtud de lo anterior, el cliente reconoce que los productos florales no son bienes estandarizados susceptibles de reintegro físico, reposición automática o devolución ordinaria una vez iniciada su preparación, despacho o entrega.",
    ],
  },
  {
    title: "3. Regla general: inexistencia de devoluciones",
    paragraphs: [
      "Como regla general, Dely Roses no acepta devoluciones, cambios, anulaciones, reversos, compensaciones ni reembolsos respecto de productos florales frescos, arreglos personalizados o pedidos preparados bajo encargo del cliente.",
      "La inexistencia de devoluciones comprende tanto la devolución física del producto como cualquier solicitud de restitución total o parcial del valor pagado cuando el producto haya sido preparado, despachado, entregado, recibido, rechazado por el destinatario o puesto a disposición en el destino indicado por el cliente.",
      "El cliente entiende y acepta que la apreciación subjetiva sobre tamaño, estilo, tonalidad, combinación floral, aroma, apertura natural de las flores, disponibilidad de variedades o diferencias razonables entre una referencia visual y el producto final no constituye causal de devolución ni de reembolso.",
    ],
  },
  {
    title: "4. Única causal de reembolso: no llegada del pedido al destino",
    paragraphs: [
      "La única circunstancia en la que Dely Roses podrá reconocer un reembolso será aquella en la que se verifique, de manera objetiva, que el pedido no llegó al destino indicado por el cliente al momento de la compra o confirmación del pedido.",
      "Para que proceda un reembolso, la falta de llegada al destino deberá ser real, comprobable y no atribuible a información incorrecta, incompleta, tardía o contradictoria proporcionada por el cliente, ni a hechos imputables al destinatario, terceros, administraciones de edificios, urbanizaciones, garitas, personal de seguridad, políticas internas del lugar de entrega o circunstancias de fuerza mayor.",
      "La entrega se considerará cumplida cuando el producto haya sido recibido por el destinatario, por una persona autorizada o razonablemente vinculada al punto de entrega, por recepción, conserjería, seguridad, administración, familiar, compañero de trabajo, personal del domicilio, establecimiento o lugar indicado, o cuando haya existido una puesta a disposición razonable en el destino conforme a las instrucciones suministradas por el cliente.",
    ],
  },
  {
    title: "5. Supuestos que no generan derecho a devolución ni reembolso",
    paragraphs: [
      "No procederá devolución ni reembolso cuando el cliente haya proporcionado una dirección errónea, incompleta, imprecisa, desactualizada o insuficiente; cuando el destinatario no se encuentre disponible; cuando el destinatario rechace el pedido; cuando no sea posible contactar al cliente o destinatario; o cuando el acceso al destino sea negado, restringido o condicionado por terceros.",
      "Tampoco procederá devolución ni reembolso por retrasos derivados de tráfico, condiciones climáticas, cierres viales, controles de seguridad, eventos públicos, accidentes, emergencias, fuerza mayor, caso fortuito, fallas de comunicación, cambios solicitados fuera de tiempo o circunstancias que razonablemente excedan el control operativo de Dely Roses.",
      "No existirá derecho a reembolso por variaciones florales razonables derivadas de disponibilidad estacional, sustituciones por flores de igual o mayor valor, diferencias naturales de color, apertura, textura, tamaño o forma, ni por el deterioro natural posterior a la entrega o manipulación del producto por parte del destinatario o terceros.",
    ],
  },
  {
    title: "6. Confirmación del pedido e inicio de preparación",
    paragraphs: [
      "Se entenderá que el pedido ha sido confirmado cuando el cliente haya comunicado su intención de compra, proporcionado los datos necesarios para la preparación o entrega, aceptado el valor correspondiente o realizado el pago total o parcial por cualquiera de los medios habilitados.",
      "Desde la confirmación del pedido, Dely Roses queda facultado para reservar insumos, coordinar logística, preparar flores, asignar personal, programar rutas y ejecutar actos necesarios para cumplir la entrega. En consecuencia, la solicitud posterior de cancelación, modificación o desistimiento no generará derecho automático a devolución, reembolso o compensación.",
      "Cualquier modificación solicitada por el cliente quedará sujeta a disponibilidad, estado de preparación, posibilidad logística y aceptación expresa por parte de Dely Roses. La imposibilidad de realizar cambios no constituirá incumplimiento ni causal de reembolso.",
    ],
  },
  {
    title: "7. Procedimiento para reportar una no entrega",
    paragraphs: [
      "Cuando el cliente considere que el pedido no llegó al destino indicado, deberá comunicarlo a Dely Roses de forma inmediata y, en todo caso, dentro de las veinticuatro horas siguientes a la fecha u horario estimado de entrega. El reporte deberá incluir el número o referencia del pedido, nombre del comprador, nombre del destinatario, dirección exacta, fecha de compra, fecha de entrega solicitada y cualquier soporte disponible.",
      "Recibido el reporte, Dely Roses revisará la información interna disponible, comunicaciones sostenidas con el cliente o destinatario, comprobantes de despacho, fotografías, mensajes, ubicación aproximada, constancias de recepción y cualquier otro elemento razonable que permita establecer si el pedido llegó o no al destino indicado.",
      "La sola manifestación de inconformidad, sin elementos verificables o sin posibilidad razonable de contrastación, no constituirá prueba suficiente para ordenar un reembolso. Dely Roses podrá solicitar información adicional cuando resulte necesaria para resolver el caso.",
    ],
  },
  {
    title: "8. Alcance del reembolso cuando proceda",
    paragraphs: [
      "Si Dely Roses verifica que el pedido no llegó al destino indicado y que dicha situación no obedece a causas imputables al cliente, destinatario o terceros, procederá el reembolso de los valores efectivamente pagados por el pedido afectado, incluyendo el valor del producto y, si corresponde, el valor de entrega pagado para dicho pedido.",
      "El reembolso no incluirá indemnizaciones adicionales, lucro cesante, daño moral, costos indirectos, diferencias de oportunidad, gastos asumidos por el cliente con terceros ni cualquier otro concepto distinto del valor efectivamente pagado a Dely Roses por el pedido no entregado.",
      "El reembolso se gestionará por el medio de pago que resulte operativamente viable, considerando las condiciones del banco, procesador de pagos, canal de cobro o método originalmente utilizado. Los tiempos de acreditación dependerán también de entidades financieras o terceros intervinientes.",
    ],
  },
  {
    title: "9. Redespacho y soluciones comerciales no obligatorias",
    paragraphs: [
      "En determinados casos, y siempre que Dely Roses lo estime viable, podrá ofrecer un nuevo intento de entrega, coordinación adicional o solución comercial alternativa. Tales medidas serán de carácter discrecional, operativo y comercial, y no implicarán reconocimiento de responsabilidad ni modificación de la regla general de no devoluciones.",
      "Cuando el nuevo intento de entrega se origine en errores de dirección, ausencia del destinatario, imposibilidad de acceso, cambios solicitados por el cliente o circunstancias ajenas a Dely Roses, el cliente podrá asumir costos adicionales de redespacho, reposición, preparación o logística.",
    ],
  },
  {
    title: "10. Prueba de entrega y recepción por terceros",
    paragraphs: [
      "Para efectos de esta política, la prueba de entrega podrá consistir en fotografía del producto en el destino, confirmación por mensaje, constancia de recepción, comunicación con el destinatario, registro interno de ruta, evidencia de entrega a personal autorizado o cualquier elemento razonable que demuestre que el producto llegó al lugar indicado.",
      "La recepción por parte de terceros ubicados en el domicilio, oficina, edificio, recepción, seguridad, garita, administración, local, establecimiento o punto señalado por el cliente será considerada entrega válida, salvo prueba objetiva en contrario.",
    ],
  },
  {
    title: "11. Vigencia, interpretación y modificaciones",
    paragraphs: [
      "Esta política permanecerá vigente mientras se encuentre publicada en el sitio web de Dely Roses o sea comunicada por los canales oficiales de atención. Dely Roses podrá actualizar, complementar o modificar su contenido cuando lo considere necesario por razones legales, operativas, comerciales o logísticas.",
      "La interpretación de esta política deberá realizarse de buena fe, atendiendo a la naturaleza perecedera de las flores frescas, la preparación personalizada de los arreglos, la logística de entregas locales y la información suministrada por el cliente al momento de realizar el pedido.",
      "En caso de contradicción entre comunicaciones informales y esta política, prevalecerá el texto publicado de la Política de Devoluciones y Reembolsos, salvo pacto escrito y expreso emitido por Dely Roses para un caso particular.",
    ],
  },
];

export default function ReturnPolicyPage() {
  const pageUrl = toAbsoluteUrl(productReturnPolicyPath);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Inicio", path: "/" },
            { name: "Política de devoluciones", path: productReturnPolicyPath },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Política de devoluciones y reembolsos",
            description:
              "Política formal de no devoluciones de Dely Roses y única causal de reembolso por no llegada del pedido al destino indicado.",
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
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-accent">Política legal</p>
          <h1 className="mt-3 max-w-4xl text-foreground">Política de devoluciones y reembolsos</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            En Dely Roses no existen devoluciones para flores frescas, arreglos florales personalizados o pedidos preparados bajo encargo. El reembolso solo procede cuando se verifica que el pedido no llegó al destino indicado por el cliente.
          </p>
          <p className="mt-4 text-sm font-bold text-accent">Última actualización: {lastUpdated}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
        <aside className="h-fit rounded-[1.75rem] border border-border bg-card p-6 shadow-sm lg:sticky lg:top-28">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Resumen ejecutivo</p>
          <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              <strong className="text-foreground">No hay devoluciones:</strong> los arreglos florales son frescos, perecederos y preparados para cada pedido.
            </p>
            <p>
              <strong className="text-foreground">Único reembolso:</strong> procede únicamente si Dely Roses verifica que el pedido no llegó al destino indicado.
            </p>
            <p>
              <strong className="text-foreground">Entrega válida:</strong> puede realizarse al destinatario o a una persona razonablemente autorizada en el punto indicado.
            </p>
          </div>
        </aside>

        <article className="space-y-6">
          <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Declaración principal</p>
            <p className="mt-4 text-lg leading-8 text-foreground">
              Por tratarse de flores frescas, bienes perecederos y diseños preparados bajo encargo, toda venta realizada por {siteConfig.name} se considera final una vez confirmado el pedido. La única excepción de reembolso será la falta comprobada de llegada del pedido al destino indicado por el cliente.
            </p>
          </div>

          {policySections.map((section) => (
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
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-foreground">12. Contacto para reportes relacionados con entregas</h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>
                Los reportes sobre una posible no entrega deberán realizarse por los canales oficiales de Dely Roses, indicando toda la información necesaria para identificar el pedido y verificar los hechos.
              </p>
              {siteConfig.whatsappUrl ? (
                <p>
                  Canal de atención: <a href={siteConfig.whatsappUrl} target="_blank" rel="noreferrer" className="font-bold text-accent hover:underline">WhatsApp oficial de Dely Roses</a>.
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
