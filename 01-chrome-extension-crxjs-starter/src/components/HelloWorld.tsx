import { useState } from 'react'

export default function HelloWorld(props: { msg: string }) {
    const [count, setCount] = useState(0)

    return (
        <div style={{
            background: '#0f172a',
            color: '#f1f5f9',
            fontFamily: 'system-ui, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            padding: 20,
            boxSizing: 'border-box',
            gap: 24,
            height: '100vh',
        }}>
            {/* Header */}
            <div>
                <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f8fafc' }}>
                    {props.msg}
                </h1>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b' }}>
                    Chrome Extension · CRXJS + React
                </p>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: '#1e293b' }} />

            {/* Counter */}
            <div style={{
                background: '#1e293b',
                borderRadius: 10,
                padding: 15,
                textAlign: 'center',
            }}>
                <div style={{ fontSize: 56, fontWeight: 700, color: '#38bdf8', lineHeight: 1 }}>
                    {count}
                </div>
                <div style={{ fontSize: 12, color: '#475569', marginTop: 8, letterSpacing: '0.05em' }}>
                    CLICK COUNT
                </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
                <button
                    type="button"
                    onClick={() => setCount(count + 1)}
                    style={{
                        flex: 1,
                        padding: '12px 0',
                        background: '#38bdf8',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Increment
                </button>
                <button
                    type="button"
                    onClick={() => setCount(0)}
                    style={{
                        padding: '12px 16px',
                        background: 'transparent',
                        color: '#64748b',
                        border: '1px solid #1e293b',
                        borderRadius: 8,
                        fontSize: 14,
                        cursor: 'pointer',
                    }}
                >
                    Reset
                </button>
            </div>

            {/* Footer */}
            <div style={{ marginTop: 'auto', fontSize: 12, color: '#334155' }}>
                Edit <code style={{ color: '#475569' }}>src/components/HelloWorld.tsx</code> to get started
            </div>
        </div>
    )
}
