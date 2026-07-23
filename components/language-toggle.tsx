"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Language = "es" | "en";

const translations: Record<string, string> = {
  Inicio: "Home",
  "Quiénes somos": "About us",
  Reserva: "Reservation",
  Contacto: "Contact",
  "Para consultas sobre próximas fechas, disponibilidad o solicitudes especiales, podés comunicarte directamente con nosotros.":
    "For inquiries about upcoming dates, availability or special requests, you can contact us directly.",
  "Una experiencia artística exclusiva": "An exclusive artistic experience",
  "Entradas": "Tickets",
  "Una velada única": "A unique evening",
  "Una experiencia exclusiva a puertas cerradas donde el arte, la música y la gastronomía se combinan en un entorno íntimo y elegante.":
    "An exclusive closed-door experience where art, music and gastronomy come together in an intimate and elegant setting.",
  "Inspiradas en las antiguas tertulias criollas de Buenos Aires, estas veladas reúnen a artistas y público en una residencia privada, ofreciendo un recorrido sensorial a través de la música de cámara, las artes visuales y una degustación gastronómica de seis pasos acompañada por vinos seleccionados.":
    "Inspired by the historic criollo gatherings of Buenos Aires, these evenings bring artists and guests together in a private residence, offering a sensory journey through chamber music, visual arts and a six-course tasting paired with selected wines.",
  "La intimidad del encuentro": "The intimacy of the gathering",
  "Imagen preparada para reemplazar por fotografía real.":
    "Image area prepared for a future real photograph.",
  "Música en vivo": "Live music",
  "La música es interpretada por los artistas residentes de Tertulias Criollas, con repertorios cuidadosamente seleccionados para crear una escucha cercana, íntima y profundamente ligada al espíritu de la velada.":
    "Music is performed by the resident artists of Tertulias Criollas, with carefully selected repertoires designed to create an intimate listening experience deeply connected to the spirit of the evening.",
  "Interpretaciones en vivo de música de cámara por artistas de trayectoria internacional en un entorno íntimo.":
    "Live chamber music performances by internationally experienced artists in an intimate setting.",
  Arte: "Art",
  "Las artes visuales acompañan cada encuentro a través de obras, objetos y propuestas que dialogan con la residencia, integrando cada espacio a una experiencia cultural sensible y refinada.":
    "Visual arts accompany each gathering through works, objects and proposals that converse with the residence, integrating each space into a sensitive and refined cultural experience.",
  "Exposición de obras originales en un recorrido guiado por los espacios de la residencia.":
    "An exhibition of original works through a guided walk across the residence.",
  Gastronomía: "Gastronomy",
  "La propuesta gastronómica está pensada para acompañar la experiencia completa, con productos seleccionados, sabores regionales y un servicio acorde al carácter íntimo y exclusivo del encuentro.":
    "The gastronomic proposal is designed to accompany the full experience, with selected products, regional flavors and service in keeping with the intimate and exclusive nature of the gathering.",
  "Experiencia culinaria de seis pasos con sabores tradicionales argentinos, acompañada por vinos seleccionados.":
    "A six-course culinary experience with traditional Argentine flavors, paired with selected wines.",
  Explorar: "Explore",
  "El jardín de la residencia": "The residence garden",
  "Residencia privada": "Private residence",
  Ubicación: "Location",
  "El lugar": "The place",
  "Una residencia privada especialmente preparada para recibir a los invitados en un entorno íntimo y cuidado.":
    "A private residence specially prepared to welcome guests in an intimate and carefully curated setting.",
  "La experiencia se realiza en una residencia privada cercana a Buenos Aires. La dirección exacta se comparte únicamente con las reservas confirmadas.":
    "The experience takes place in a private residence near Buenos Aires. The exact address is shared only with confirmed reservations.",
  "Abrir en Google Maps": "Open in Google Maps",
  "Redes y contacto": "Social media and contact",
  "Contacto directo": "Direct contact",
  "Novedades, registros visuales y próximas fechas.":
    "News, visual records and upcoming dates.",
  "Ver Instagram": "View Instagram",
  "Conocé más sobre nuestros artistas y experiencias.":
    "Learn more about our artists and experiences.",
  "Ver canal": "View channel",
  "Consultas directas sobre cupos y disponibilidad.":
    "Direct inquiries about seats and availability.",
  Consultar: "Contact us",
  "Contacto institucional y solicitudes especiales.":
    "Institutional contact and special requests.",
  "Escribir email": "Write email",
  "Experiencias culturales exclusivas": "Exclusive cultural experiences",
  "Música · Arte · Gastronomía": "Music · Art · Gastronomy",
  "Activar sonido": "Enable sound",
  Silenciar: "Mute",
  "English version": "English version",
  "Volver a Tertulias Criollas": "Back to Tertulias Criollas",
  "Próximo evento": "Next event",
  "Próxima velada": "Next evening",
  "Próximas veladas": "Upcoming evenings",
  "Próxima velada · Sábado 26 de julio · 18:00 hs":
    "Next evening · Saturday, July 26 · 6:00 PM",
  "Duración 2 h 30 min": "Duration 2 h 30 min",
  "Últimos sábados de cada mes": "Last Saturdays of each month",
  "Próxima fecha: sábado 25 de julio":
    "Next date: Saturday, July 25",
  "Inicio: 18:00 hs": "Start: 6:00 PM",
  "Duración aproximada: 2 horas y 30 minutos":
    "Approximate duration: 2 hours and 30 minutes",
  "Ver entradas": "View tickets",
  "Una nueva edición de Tertulias Criollas está en preparación.":
    "A new edition of Tertulias Criollas is being prepared.",
  "Sábado 25 de julio · 18:00 hs": "Saturday, July 25 · 6:00 PM",
  "Duración aproximada: 2 h 30 min":
    "Approximate duration: 2 h 30 min",
  "Reservar entrada →": "Reserve ticket →",
  "Último sábado del mes": "Last Saturday of the month",
  "Reservar entrada": "Reserve ticket",
  "Próxima experiencia": "Next experience",
  "Completá tus datos para solicitar tu lugar. La reserva queda sujeta a disponibilidad y se confirma una vez acreditado el pago.":
    "Complete your details to request your place. The reservation is subject to availability and is confirmed once payment is credited.",
  "Consultando cupos...": "Checking availability...",
  "Cupos disponibles:": "Available seats:",
  de: "of",
  "Cada solicitud corresponde a una reserva individual.":
    "Each request corresponds to an individual reservation.",
  Fecha: "Date",
  Horario: "Time",
  "18:00 hs": "6:00 PM",
  "Duración aproximada": "Approximate duration",
  "2 horas y 30 minutos": "Approximately 2 hours and 30 minutes",
  Lugar: "Venue",
  "Casona La EnriSu": "Casona La EnriSu",
  Modalidad: "Modality",
  "Reserva con pago total": "Reservation with full payment",
  Cupos: "Seats",
  "Medios de pago": "Payment methods",
  "Se aceptan todos los medios de pago. La transferencia bancaria es el medio principal. También se encuentran disponibles Mercado Pago, PayPal y otros medios a coordinar.":
    "All payment methods are accepted. Bank transfer is the main payment method. Mercado Pago, PayPal and other methods to be coordinated are also available.",
  "Mercado Pago puede tener un recargo del 10%.":
    "Mercado Pago may have a 10% surcharge.",
  "Participación": "Participation",
  "Experiencia completa: USD 270 por persona.":
    "Full experience: USD 270 per person.",
  "Residentes en Argentina: 30 % de descuento.":
    "Residents in Argentina: 30% discount.",
  "Transporte opcional: USD 38 por persona.":
    "Optional transportation: USD 38 per person.",
  "Para confirmar la reserva se solicita el pago total del valor correspondiente.":
    "To confirm the reservation, full payment of the corresponding amount is required.",
  "Información importante": "Important information",
  "Se recomienda asistir con una vestimenta acorde al carácter de la velada.":
    "We recommend attending in attire appropriate to the character of the evening.",
  "¿Qué sucede después?": "What happens next?",
  "Completás la solicitud.": "You complete the request.",
  "Recibís por email los datos para realizar el pago.":
    "You receive the payment details by email.",
  "Enviás el comprobante por WhatsApp.":
    "You send the receipt by WhatsApp.",
  "Recibís la confirmación definitiva de tu entrada.":
    "You receive the final confirmation of your ticket.",
  "Nombre y apellido": "Full name",
  "DNI o pasaporte": "ID or passport",
  "Fecha de nacimiento": "Date of birth",
  Email: "Email",
  Residencia: "Residence",
  Teléfono: "Phone",
  "Tu nombre completo": "Your full name",
  "Número de documento": "Document number",
  "nombre@email.com": "name@email.com",
  "Ciudad o país": "City or country",
  Opcional: "Optional",
  "Solicitud recibida. Nos contactaremos por email para continuar con la confirmación del pago.":
    "Request received. We will contact you by email to continue with payment confirmation.",
  "No pudimos enviar la solicitud. Intentá nuevamente.":
    "We could not send the request. Please try again.",
  "No quedan cupos disponibles para esta edición.":
    "There are no seats available for this edition.",
  "Los cupos para esta edición se encuentran completos.":
    "Seats for this edition are sold out.",
  "Reservar lugar": "Reserve place",
  "Reservar mi lugar": "Reserve my place",
  "Enviando...": "Sending...",
  "Artistas anfitriones": "Host artists",
  "Los Hemmingsen son una familia de artistas argentinos que abren las puertas de su casa para compartir una experiencia íntima donde la música, las artes visuales y la gastronomía se encuentran en una velada única.":
    "The Hemmingsens are a family of Argentine artists who open the doors of their home to share an intimate experience where music, visual arts and gastronomy meet in a unique evening.",
  "Tenor · Director Orquestal": "Tenor · Orchestral Conductor",
  "Artista Plástica": "Visual Artist",
  Soprano: "Soprano",
  "Graduado con honores en Música de Cámara y Dirección Orquestal por la Universidad Nacional de La Plata. Formado por destacados maestros nacionales e internacionales, desarrolló una sólida trayectoria artística y docente, con participación en seminarios y masterclasses en instituciones como el Teatro Colón.":
    "Graduated with honors in Chamber Music and Orchestral Conducting from the National University of La Plata. Trained by prominent national and international teachers, he developed a solid artistic and teaching career, participating in seminars and masterclasses at institutions such as Teatro Colón.",
  "Licenciada en Artes Plásticas con especialización en Pintura y Escultura por la Universidad Nacional de La Plata. Su trayectoria incluye premios, exposiciones y una reconocida labor artística, destacándose por su trabajo escultórico y pictórico.":
    "A graduate in Visual Arts with a specialization in Painting and Sculpture from the National University of La Plata. Her career includes awards, exhibitions and recognized artistic work, standing out for her sculptural and pictorial practice.",
  "Formada en el Conservatorio Nacional Carlos López Buchardo y en el Instituto Superior de Arte del Teatro Colón. Ha desarrollado una extensa carrera como solista en importantes escenarios nacionales e internacionales.":
    "Trained at the Carlos López Buchardo National Conservatory and the Higher Institute of Art of Teatro Colón. She has developed an extensive career as a soloist on important national and international stages.",
  Administración: "Administration",
  Reservas: "Reservations",
  "Reservas totales": "Total reservations",
  Pendientes: "Pending",
  Confirmadas: "Confirmed",
  "Cupos ocupados": "Occupied seats",
  "Cupos restantes": "Remaining seats",
  Nombre: "Name",
  Documento: "Document",
  Status: "Status",
  Creada: "Created",
  Acción: "Action",
  "Cargando reservas...": "Loading reservations...",
  "Todavía no hay reservas.": "There are no reservations yet.",
  "Confirmando...": "Confirming...",
  "Confirmar pago": "Confirm payment",
  "Pago confirmado y voucher enviado al visitante.":
    "Payment confirmed and voucher sent to the visitor.",
  "No se pudieron cargar las reservas.": "Reservations could not be loaded.",
  "No se pudo confirmar la reserva.": "The reservation could not be confirmed.",
  "Registros de las interpretaciones de cámara y los momentos musicales que dan forma a cada tertulia.":
    "Records of the chamber performances and musical moments that shape each gathering.",
  "Un recorrido visual por obras, texturas y espacios intervenidos que acompañan la experiencia.":
    "A visual journey through works, textures and curated spaces that accompany the experience.",
  "Imágenes de la degustación, los vinos seleccionados y la mesa pensada para una velada exclusiva.":
    "Images of the tasting, selected wines and the table designed for an exclusive evening.",
  "Volver al inicio": "Back to home"
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function applyTextPreservingLanguage(element: Element, language: Language) {
  const originalText =
    element.getAttribute("data-original-text") ||
    normalizeText(element.textContent || "");

  if (!originalText || !(originalText in translations)) {
    return;
  }

  element.setAttribute("data-original-text", originalText);
  const translatedText = language === "en" ? translations[originalText] : originalText;

  if (normalizeText(element.textContent || "") !== translatedText) {
    element.textContent = translatedText;
  }
}

function applyAttributeTranslation(
  element: Element,
  attribute: "placeholder" | "aria-label" | "title",
  language: Language
) {
  const value = element.getAttribute(attribute);

  if (!value) {
    return;
  }

  const dataAttribute = `data-original-${attribute}`;
  const originalValue = element.getAttribute(dataAttribute) || normalizeText(value);

  if (!(originalValue in translations)) {
    return;
  }

  element.setAttribute(dataAttribute, originalValue);
  const translatedValue =
    language === "en" ? translations[originalValue] : originalValue;

  if (value !== translatedValue) {
    element.setAttribute(attribute, translatedValue);
  }
}

function translatePage(language: Language) {
  document.documentElement.lang = language;

  document
    .querySelectorAll<HTMLElement>(
      "h1,h2,h3,p,span,a,button,label,th,td,li,input,textarea"
    )
    .forEach((element) => {
      if (element.closest("[data-no-translate]")) {
        return;
      }

      applyAttributeTranslation(element, "placeholder", language);
      applyAttributeTranslation(element, "aria-label", language);
      applyAttributeTranslation(element, "title", language);

      if (element.children.length === 0) {
        applyTextPreservingLanguage(element, language);
      }
    });

  document.querySelectorAll("input,textarea").forEach((element) => {
    applyAttributeTranslation(element, "placeholder", language);
  });
}

export function LanguageToggle() {
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>("es");
  const isAdminRoute = pathname.startsWith("/admin");

  const buttonLabel = language === "es" ? "EN" : "ES";

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    const savedLanguage = window.localStorage.getItem("site-language");

    if (savedLanguage === "en") {
      setLanguage("en");
    }
  }, [isAdminRoute]);

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    window.localStorage.setItem("site-language", language);
    translatePage(language);

    const observer = new MutationObserver(() => {
      translatePage(language);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => observer.disconnect();
  }, [isAdminRoute, language]);

  if (isAdminRoute) {
    return null;
  }

  return (
    <button
      type="button"
      data-no-translate
      onClick={() => setLanguage((current) => (current === "es" ? "en" : "es"))}
      className="fixed right-3 top-[5.9rem] z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/55 font-[var(--font-heading)] text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-100 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white/40 hover:bg-black/75 min-[420px]:right-4 min-[420px]:top-[5.75rem] min-[420px]:h-11 min-[420px]:w-11 sm:right-6 sm:top-[5.5rem] sm:h-12 sm:w-12 sm:text-xs lg:top-24"
      aria-label={language === "es" ? "Translate to English" : "Cambiar a español"}
    >
      {buttonLabel}
    </button>
  );
}
