import { useState, useRef, useEffect } from 'react'
import './App.css'

const DATOS = {
  "9012664906": { nombre: "Proveedor A", estados: [{ numero_factura: "FAC001", fecha_documento: "2026-05-13", valor_pagar: 2000000 }], retenciones: [{ tipo: "Fuente", indicador: "RET-SERVICIOS", valor: 80000, numero_documento: "6200124" }] },
  "9004402539": { nombre: "Proveedor B", estados: [{ numero_factura: "FAC002", fecha_documento: "2026-06-01", valor_pagar: 5000000 }], retenciones: [{ tipo: "ICA", indicador: "RETENCION ICA", valor: 150000, numero_documento: "6200125" }] },
  "8000183883": { nombre: "Proveedor C", estados: [{ numero_factura: "FAC003", fecha_documento: "2026-06-10", valor_pagar: 3500000 }], retenciones: [{ tipo: "IVA", indicador: "RETENCION IVA", valor: 525000, numero_documento: "6200126" }] }
}

export default function App() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: '¡Hola 👋 Bienvenido a UNIBOL!\n\n¿Cuál es tu NIT?' }
  ])
  const [userInput, setUserInput] = useState('')
  const [step, setStep] = useState('nit')
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPDF, setShowPDF] = useState(false)

  const handleSendMessage = () => {
    if (!userInput.trim()) return
    const newMessage = { type: 'user', text: userInput }
    setMessages([...messages, newMessage])
    setUserInput('')
    setLoading(true)
    setTimeout(() => {
      procesarMensaje(userInput)
      setLoading(false)
    }, 500)
  }

  const procesarMensaje = (input) => {
    let response = ''

    if (step === 'nit') {
      const nit = input.trim()
      if (DATOS[nit]) {
        setUserData({ nit, nombre: DATOS[nit].nombre, ...DATOS[nit] })
        response = `✓ Encontré: ${DATOS[nit].nombre}\n\nElige una opción:\n1️⃣ Estados de Cuentas\n2️⃣ Retenciones Aplicadas\n3️⃣ Envío de Certificados`
        setStep('opcion')
      } else {
        response = '❌ NIT no encontrado. Intenta con: 9012664906, 9004402539 o 8000183883'
      }
    } else if (step === 'opcion') {
      if (input === '1') {
        if (userData.estados && userData.estados.length > 0) {
          response = `📊 ESTADOS DE CUENTAS\n\n`
          userData.estados.forEach(est => {
            response += `Factura: ${est.numero_factura}\nFecha: ${est.fecha_documento}\nValor: $${est.valor_pagar.toLocaleString()}\n\n`
          })
        } else {
          response = '❌ No hay estados'
        }
        response += `¿Otra opción? (1, 2, 3)`
      } else if (input === '2') {
        if (userData.retenciones && userData.retenciones.length > 0) {
          response = `💰 RETENCIONES APLICADAS\n\n`
          userData.retenciones.forEach(ret => {
            response += `${ret.tipo}\nIndicador: ${ret.indicador}\nValor: $${ret.valor.toLocaleString()}\nDoc: ${ret.numero_documento}\n\n`
          })
        } else {
          response = '❌ No hay retenciones'
        }
        response += `¿Otra opción? (1, 2, 3)`
      } else if (input === '3') {
        setShowPDF(true)
        response = `📄 ENVÍO DE CERTIFICADOS\n\nDescarga el instructivo abajo.\n¿Otra opción? (1, 2, 3)`
      } else {
        response = '❌ Elige 1, 2 o 3'
      }
    }

    setMessages(prev => [...prev, { type: 'bot', text: response }])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '600px', width: '100%', maxWidth: '500px', background: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        
        <div style={{ background: '#d32f2f', color: '#fff', padding: '1rem', textAlign: 'center', fontWeight: 600 }}>
          UNIBOL - Gestión de Certificados
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap', background: msg.type === 'user' ? '#007bff' : '#e9ecef', color: msg.type === 'user' ? '#fff' : '#000' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <div style={{ padding: '10px', borderRadius: '12px', background: '#e9ecef', fontSize: '14px' }}>Escribiendo...</div>}
        </div>

        {showPDF && (
          <div style={{ padding: '8px', borderTop: '1px solid #e0e0e0', background: '#f0f0f0' }}>
            <button style={{ background: '#d32f2f', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
              📥 Ver Instructivo PDF
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid #e0e0e0' }}>
          <input type="text" placeholder="Respuesta..." value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} style={{ flex: 1, border: '1px solid #d0d0d0', borderRadius: '24px', padding: '10px 16px', fontSize: '14px' }} disabled={loading} />
          <button onClick={handleSendMessage} style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }} disabled={loading}>➤</button>
        </div>
      </div>
    </div>
  )
}