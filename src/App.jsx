import { useState, useRef, useEffect } from 'react'
import './App.css'

export default function App() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: '¡Hola 👋 Bienvenido a UNIBOL Certificados Tributarios!\n\n¿Cuál es tu NIT?' }
  ])
  const [userInput, setUserInput] = useState('')
  const [step, setStep] = useState('nit')
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)

  const vendorData = {
    "8000081512": { nombre: "EMPRESA PARA PROYECTO IA", docs: 11 },
    "8000625919": { nombre: "EMPRESA PARA PROYECTO IA", docs: 9 },
    "8000667787": { nombre: "EMPRESA PARA PROYECTO IA", docs: 9 },
    "8001719291": { nombre: "EMPRESA PARA PROYECTO IA", docs: 105 },
  }

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
      if (vendorData[nit]) {
        setUserData({ nit, ...vendorData[nit] })
        response = `✓ Encontré: ${vendorData[nit].nombre}\n\n1️⃣ Fuente\n2️⃣ IVA\n3️⃣ ICA`
        setStep('cert_type')
      } else {
        response = '❌ NIT no encontrado. Ej: 8000081512'
      }
    } else if (step === 'cert_type') {
      if (input === '1') {
        setUserData({ ...userData, certType: 'Fuente' })
        response = `Fechas? Ej: 01/06/2026 a 30/06/2026`
        setStep('dates')
      } else if (input === '2') {
        setUserData({ ...userData, certType: 'IVA' })
        response = `Fechas? Ej: 01/06/2026 a 30/06/2026`
        setStep('dates')
      } else if (input === '3') {
        setUserData({ ...userData, certType: 'ICA' })
        response = `Fechas? Ej: 01/06/2026 a 30/06/2026`
        setStep('dates')
      } else {
        response = '❌ Elige 1, 2 o 3'
      }
    } else if (step === 'dates') {
      setUserData({ ...userData, fecha: input })
      response = `✅ ¡Solicitud generada!\n\n📄 ${userData.certType}\nNIT: ${userData.nit}\n\n¿Otro? (sí/no)`
      setStep('fin')
    } else if (step === 'fin') {
      if (input.toLowerCase().startsWith('s')) {
        setMessages([{ type: 'bot', text: '¡Hola 👋 Bienvenido!\n\n¿Cuál es tu NIT?' }])
        setStep('nit')
        setUserData({})
        return
      } else {
        response = '👋 Gracias. ¡Hasta luego!'
      }
    }
    setMessages(prev => [...prev, { type: 'bot', text: response }])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '600px', width: '100%', maxWidth: '500px', background: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ background: '#d32f2f', color: '#fff', padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '16px' }}>
          UNIBOL - Certificados Tributarios
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5', whiteSpace: 'pre-wrap', background: msg.type === 'user' ? '#007bff' : '#e9ecef', color: msg.type === 'user' ? '#fff' : '#1a1a1a' }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#e9ecef', fontSize: '14px' }}>
                Escribiendo...
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '8px', padding: '12px', background: '#fff', borderTop: '1px solid #e0e0e0' }}>
          <input
            type="text"
            placeholder="Escribe tu respuesta..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{ flex: 1, border: '1px solid #d0d0d0', borderRadius: '24px', padding: '10px 16px', fontSize: '14px', fontFamily: 'inherit', outline: 'none' }}
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 600 }}
            disabled={loading}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}