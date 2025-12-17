import { Solution } from '../models/solutions.model';

/**
 * Datos estáticos para el apartado de soluciones.
 *
 * Nota:
 * - imgKey / imgsKeys usan el nombre lógico de la imagen (ej: 'brainMonitorHero').
 *   La capa de presentación (landing / web pública) será la encargada de mapear
 *   estas claves a imports reales de imágenes o assets.
 * - iconKey usa nombres lógicos de iconos (Eye, Timer, AlertCircle, etc.) para
 *   que la UI decida qué componente de icono renderizar.
 */
export const solutionsData: Record<string, Solution> = {
  'brain-monitor': {
    id: 'brain-monitor',
    imgKey: 'brainMonitorHero',
    sectionTitle: 'VZOR®️ Brain Monitor',
    title:
      'Anticipa fallas antes de que ocurran con inteligencia artificial. Detecta comportamientos anómalos y pronostica incidentes críticos con modelos de aprendizaje profundo entrenados sobre tus propios datos.',
    subtitle: 'Inteligencia Operacional con IA',
    description: [
      'VZOR®️ Brain Monitor, es una solución complementaria de nuestra suite, la cual ofrece dos funcionalidades diferentes que se basan en machine learning y deep learning.',
      'La solución VZOR®️ Brain Monitor para detección de anomalías en la infraestructura tecnológica y VZOR®️ Brain Monitor para pronóstico de incidencias sobre los servicios. Ambas soluciones disponibles en VZOR®️ Suite 360®️.',
      'La detección de anomalías aprende del comportamiento de los sensores en la infraestructura tecnológica y en base a ese aprendizaje es capaz de moderar las alarmas generadas por superación de umbrales.',
      'En cuanto al sistema de pronóstico de incidencias, este es a nivel de aprendizaje sobre los eventos e incidentes que tienen los distintos servicios, pudiendo de esta forma clasificarlos, correlacionarlos y así calcular un porcentaje de pronóstico de ocurrencia de incidente a futuro.',
    ],
    mainFeatures: [
      {
        id: 1,
        title: 'Detección automática de anomalías operativas',
        desc: 'Analiza en tiempo real las métricas históricas y actuales para identificar comportamientos fuera de patrón. Reduce falsos positivos y alerta solo cuando existe riesgo real.',
      },
      {
        id: 2,
        title: 'Modelos de IA entrenados sobre tu infraestructura',
        desc: 'Cada modelo aprende del comportamiento específico de tus dispositivos, servicios o aplicaciones. Adapta su sensibilidad según el contexto operativo real.',
      },
      {
        id: 3,
        title: 'Pronóstico de incidentes con hasta 3 horas de anticipación',
        desc: 'Predice cuándo y dónde ocurrirá una falla, permitiendo actuar antes de que afecte al negocio. Ideal para servicios críticos o con alta dependencia tecnológica.',
      },
      {
        id: 4,
        title: 'Ajuste dinámico de criticidad en alertas',
        desc: 'Recalibra automáticamente el nivel de severidad de las alertas según el grado de anormalidad detectado. Prioriza lo importante y elimina el ruido.',
      },
    ],
    imgsKeys: ['brainMonitor', 'brainMonitor', 'brainMonitor', 'brainMonitor'],
    features: [
      {
        text: 'Monitoreo de la infraestructura de manera inteligente en base al comportamiento',
      },
      {
        text: 'Detección temprana de anomalías',
        iconKey: 'Eye',
      },
      {
        text: 'Pronósticar posibles incidentes',
        iconKey: 'ArrowLeftRight',
      },
      {
        text: 'Alarmas y escalamiento Automáticos a través de la creación de tickets',
        iconKey: 'Timer',
      },
    ],
  },

  // Ejemplo de otra solución. Puedes completar las demás
  // ('apps-monitor', 'bussiness-monitor', 'apm', 'stress-monitor', 'infra-monitor')
  // siguiendo el mismo patrón.
  'apps-monitor': {
    id: 'apps-monitor',
    imgKey: 'appsMonitor',
    sectionTitle: 'VZOR®️ Apps Monitor',
    title:
      'Monitorea el estado, rendimiento y disponibilidad de tus aplicaciones web, Android, microservicios y legados. Asegura la continuidad digital con visibilidad total de la experiencia de tus usuarios.',
    subtitle: 'Monitoreo sintético de Aplicaciones Web & Android',
    description: [
      'VZOR®️ Apps Monitor es capaz de monitorear todo el ecosistema de aplicaciones Web, Android y Legacy además de sus microservicios HTTP y TCP, siendo muy amplio, eficiente y flexible en el monitoreo de aplicaciones.',
      'Así mismo permite la interoperabilidad de las diversas aplicaciones y plataformas de negocio, presentando en tiempo real indicadores de disponibilidad y rendimiento, asegurando la continuidad operacional en sus servicios.',
      'Es importante destacar que es una solución SaaS & On-Premise, innovadora y flexible.',
    ],
    mainFeatures: [
      {
        id: 1,
        title: 'Monitoreo sintético y real de aplicaciones',
        desc: 'Simula interacciones de usuario y captura métricas reales de uso para detectar caídas, lentitud o fallos antes de que afecten al cliente final. Evalúa la experiencia en canales web, APIs, apps Android o plataformas legadas de forma proactiva.',
      },
      {
        id: 2,
        title: 'Supervisión de microservicios y APIs distribuidas',
        desc: 'Visualiza cómo se comportan tus aplicaciones modernas basadas en contenedores o arquitecturas desacopladas. Detecta cuellos de botella, errores en la cadena de servicios y llamadas externas que degradan el rendimiento.',
      },
      {
        id: 3,
        title: 'Detección de errores, caídas y tiempos de respuesta anómalos',
        desc: 'Recoge métricas de latencia, disponibilidad, código de error y respuesta para identificar degradaciones, inestabilidad o interrupciones en los flujos críticos de negocio.',
      },
      {
        id: 4,
        title: 'Dashboards operativos y semáforos de disponibilidad',
        desc: 'Crea paneles de control personalizados con KPIs clave para las áreas de desarrollo, operaciones o experiencia digital. Utiliza semáforos visuales para facilitar la interpretación rápida del estado de cada servicio o entorno.',
      },
    ],
    imgsKeys: ['appsMonitor1', 'appsMonitor2', 'appsMonitor3', 'appsMonitor4'],
    features: [
      {
        text: 'Monitoreo sintético de las aplicaciones Web, Android y Legacy',
        iconKey: 'Timer',
      },
      {
        text: 'Monitoreo de microservicios HTTP y TCP',
        iconKey: 'Eye',
      },
      {
        text: 'Monitoreo sintético de aplicaciones Legacy y Cliente/Servidor',
        iconKey: 'Timer',
      },
      {
        text: 'Alarmas y escalamiento automatizados',
        iconKey: 'Timer',
      },
    ],
  },
};


