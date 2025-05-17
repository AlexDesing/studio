
import type React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/AppLogo';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-4 shadow-sm">
        <div className="container mx-auto px-6 flex justify-start">
          <Link href="/" passHref>
            <AppLogo iconSize={28} />
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Política de Privacidad de MovaZen</h1>
        
        <section className="space-y-6 text-muted-foreground">
          <p>Última actualización: [Fecha de Última Actualización]</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">1. Introducción</h2>
          <p>Bienvenido/a a MovaZen ("nosotros", "nuestro", o "la Aplicación"). Nos comprometemos a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos tu información cuando utilizas nuestra aplicación móvil y sitio web (colectivamente, los "Servicios"). Por favor, lee esta política de privacidad cuidadosamente. SI NO ESTÁS DE ACUERDO CON LOS TÉRMINOS DE ESTA POLÍTICA DE PRIVACIDAD, POR FAVOR NO ACCEDAS A LOS SERVICIOS.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">2. Recopilación de tu Información</h2>
          <p>Podemos recopilar información sobre ti de varias maneras. La información que podemos recopilar a través de los Servicios incluye:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Datos Personales:</strong> Información de identificación personal, como tu nombre, dirección de correo electrónico, que nos proporcionas voluntariamente cuando te registras en los Servicios o cuando eliges participar en diversas actividades relacionadas con los Servicios, como el chat en línea y los tablones de mensajes.</li>
            <li><strong>Datos de Uso:</strong> Información que nuestros servidores recopilan automáticamente cuando accedes a los Servicios, como tu dirección IP, tipo de navegador, sistema operativo, tiempos de acceso y las páginas que has visto directamente antes y después de acceder a los Servicios.</li>
            <li><strong>Datos de Dispositivos Móviles:</strong> Información del dispositivo, como el ID de tu dispositivo móvil, modelo y fabricante, y información sobre la ubicación de tu dispositivo, si accedes a los Servicios desde un dispositivo móvil.</li>
            <li><strong>Datos de Terceros:</strong> Información de terceros, como información personal o amigos de la red, si conectas tu cuenta a un tercero y concedes a los Servicios permiso para acceder a esta información.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">3. Uso de tu Información</h2>
          <p>Tener información precisa sobre ti nos permite ofrecerte una experiencia fluida, eficiente y personalizada. Específicamente, podemos usar la información recopilada sobre ti a través de los Servicios para:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>Crear y gestionar tu cuenta.</li>
            <li>Enviarte un correo electrónico con respecto a tu cuenta o pedido.</li>
            <li>Permitir la comunicación entre usuarios.</li>
            <li>Generar un perfil personal sobre ti para hacer futuras visitas a los Servicios más personalizadas.</li>
            <li>Aumentar la eficiencia y el funcionamiento de los Servicios.</li>
            <li>Monitorear y analizar el uso y las tendencias para mejorar tu experiencia con los Servicios.</li>
            <li>Notificarte sobre actualizaciones de los Servicios.</li>
            <li>Ofrecerte nuevos productos, servicios y/o recomendaciones.</li>
            <li>Cumplir y gestionar compras, pedidos, pagos y otras transacciones relacionadas con los Servicios.</li>
            <li>Prevenir actividades fraudulentas, monitorear contra el robo y proteger contra la actividad criminal.</li>
            <li>Solicitar retroalimentación y contactarte sobre tu uso de los Servicios.</li>
            <li>Resolver disputas y solucionar problemas.</li>
            <li>Responder a solicitudes de productos y servicio al cliente.</li>
            <li>Enviarte un boletín informativo.</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground pt-4">4. Divulgación de tu Información</h2>
          <p>Podemos compartir información que hemos recopilado sobre ti en ciertas situaciones. Tu información puede ser divulgada de la siguiente manera:</p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li><strong>Por Ley o para Proteger Derechos:</strong> Si creemos que la divulgación de información sobre ti es necesaria para responder a un proceso legal, para investigar o remediar posibles violaciones de nuestras políticas, o para proteger los derechos, la propiedad y la seguridad de otros, podemos compartir tu información según lo permitido o requerido por cualquier ley, regla o regulación aplicable.</li>
            <li><strong>Proveedores de Servicios de Terceros:</strong> Podemos compartir tu información con terceros que realizan servicios para nosotros o en nuestro nombre, incluido el procesamiento de pagos, análisis de datos, entrega de correo electrónico, servicios de hosting, servicio al cliente y asistencia de marketing.</li>
            <li><strong>Servicios de IA de Terceros:</strong> Al utilizar funciones de IA (como el generador de afirmaciones o el asistente de IA), los datos que proporciones (como tus necesidades o entradas de chat) se enviarán a proveedores de IA de terceros (por ejemplo, Google a través de Genkit) para procesar tu solicitud y generar una respuesta. Estos proveedores tienen sus propias políticas de privacidad.</li>
          </ul>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">5. Seguridad de tu Información</h2>
          <p>Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger tu información personal. Si bien hemos tomado medidas razonables para asegurar la información personal que nos proporcionas, ten en cuenta que a pesar de nuestros esfuerzos, ninguna medida de seguridad es perfecta o impenetrable, y ningún método de transmisión de datos puede garantizarse contra cualquier intercepción u otro tipo de uso indebido.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">6. Política para Niños</h2>
          <p>No solicitamos conscientemente información ni comercializamos a niños menores de 13 años. Si te das cuenta de que hemos recopilado información personal de un niño menor de 13 años, contáctanos utilizando la información de contacto que se proporciona a continuación.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">7. Opciones Respecto a tu Información</h2>
          <p>Puedes revisar o cambiar la información de tu cuenta en cualquier momento o terminar tu cuenta iniciando sesión en la configuración de tu cuenta y actualizando tu cuenta o contactándonos utilizando la información de contacto proporcionada a continuación.</p>
          
          <h2 className="text-xl font-semibold text-foreground pt-4">8. Cambios a esta Política de Privacidad</h2>
          <p>Podemos actualizar esta Política de Privacidad de vez en cuando. Te notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página. Se te aconseja revisar esta Política de Privacidad periódicamente para cualquier cambio. Los cambios a esta Política de Privacidad son efectivos cuando se publican en esta página.</p>

          <h2 className="text-xl font-semibold text-foreground pt-4">9. Contáctanos</h2>
          <p>Si tienes preguntas o comentarios sobre esta Política de Privacidad, por favor contáctanos en: [Tu Email de Contacto o Enlace a Formulario de Contacto]</p>
        </section>
      </main>
      <footer className="py-8 border-t border-border mt-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm">&copy; {new Date().getFullYear()} MovaZen. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
