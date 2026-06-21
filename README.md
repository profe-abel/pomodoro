FocusFlow 🍅

Pomodoro para quienes manejan múltiples proyectos al mismo tiempo.
Construido como herramienta personal y evolucionado en público.

**Demo:** https://profe-abel.github.io/pomodoro/

---

## ¿Por qué existe esto?

Los pomodoros clásicos asumen que trabajás en una sola cosa.
La realidad de un consultor independiente es distinta: múltiples proyectos,
clientes, productos propios y tareas de gestión corriendo en paralelo.

FocusFlow resuelve eso con dos ideas simples:

1. **Modos de energía** — antes de empezar el día elegís cómo está tu
   energía, y la app te sugiere en qué tipo de trabajo enfocarte.
2. **Proyectos con historial** — cada pomodoro queda registrado contra
   un proyecto, para que al final del día sepas exactamente dónde fue
   tu tiempo.

---

## Uso

### Al abrir la app

Verás la pantalla de selección de energía. Elegí honestamente cómo estás:

| Nivel | Cuándo usarlo | Modo sugerido |
|-------|--------------|---------------|
| ⚡ Alta | Mañana temprano, después de dormir bien | Creativo: diseño, propuestas, contenido |
| 🔋 Media | Media mañana o post-almuerzo | Técnico: cómputos, documentación, código |
| 🌙 Baja | Tarde, cansado, muchas reuniones | Gestión: emails, CRM, planificación |

Hacé clic en **Empezar el día →** para entrar a la app.

### Durante el día

1. **Seleccioná un proyecto** en el panel izquierdo (o agregá uno nuevo).
2. Escribí brevemente en qué vas a trabajar en el campo "¿En qué estás trabajando?".
3. Presioná **Iniciar** y enfocate hasta que suene.
4. Tomá el descanso que indica el timer — no lo salteés.
5. Repetí.

### Ciclos

El timer sigue la técnica Pomodoro estándar:
- 25 min de trabajo → 5 min de descanso corto
- Después de 4 pomodoros → 15 min de descanso largo
- Los dots en la pantalla muestran en qué ciclo vas

### Panel de proyectos

- Hacé clic en un proyecto para seleccionarlo
- El número al lado muestra los pomos completados hoy en ese proyecto
- `×` para eliminar un proyecto (no borra el historial de sesiones)
- Las sugerencias arriba cambian según el modo de energía del día

### Dashboard

El panel derecho muestra en tiempo real:
- Pomodoros completados hoy
- Tiempo de foco acumulado
- El proyecto al que más tiempo le dedicaste
- Barras semanales para ver la consistencia a lo largo de la semana
- Historial de las últimas 10 sesiones con tarea, tipo y hora

---

## Datos y privacidad

Todo se guarda en `localStorage` del navegador — nada sale de tu dispositivo.
Para borrar el historial usá el botón **Borrar** en el panel derecho.
Para cambiar el modo de energía usá **Cambiar modo** en la barra superior.

---

## Roadmap

- [ ] Configuración de duración por proyecto (algunos necesitan 45 min)
- [ ] Exportar historial a CSV
- [ ] Nota rápida al terminar cada pomodoro ("¿dónde quedé?")
- [ ] PWA para instalar en móvil

---

## Créditos

Desarrollado por [Jesús Abel Fleitas](https://github.com/profe-abel) —
arquitecto y consultor de construcción, Paraguay.

Parte del ecosistema [CimientoDigital](https://cimientodigital.com) —
herramientas digitales para la industria de la construcción.
```
