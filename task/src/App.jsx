import React, { useState, useEffect } from 'react'
import styles from './App.module.css'

function App() {
  const [members, setMembers] = useState([])
  const [selectedMember, setSelectedMember] = useState(null)
  const [date, setDate] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('https://task.moraspirit.com/api/members')
      .then(res => res.json())
      .then(data => setMembers(data.members))
  }, [])

  async function checkAvailability() {
    if (!selectedMember || !date) return
    setLoading(true)
    const res = await fetch('https://task.moraspirit.com/api/availability/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msp_id: selectedMember.id, date })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className={styles.page}>
      <div className={styles.dashboard}>

        <h2 className={styles.h2}>Member Availability Dashboard</h2>
        

        <h4 className={styles.h4}>Members</h4>
        <div className={styles.membersGrid}>
          {members.map(m => (
            <div
              key={m.id}
              className={`${styles.memberCard} ${selectedMember?.id === m.id ? styles.selected : ''}`}
              onClick={() => { setSelectedMember(m); setResult(null) }}
            >
              {/*<div className={styles.avatar}>
                {m.name.split(' ').slice(0, 2).map(w => w[0]).join('')}
              </div>*/}
              <p className={styles.memberName}>{m.name}</p>
              <p className={styles.memberRole}>{m.role}</p>
            </div>
          ))}
        </div>

        <h4 className={styles.h4}>Check Availability</h4>
        <div className={styles.search}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Selected Member</label>
            <div className={styles.memberDisplay}>
              {selectedMember ? `${selectedMember.name} — ${selectedMember.role}` : 'Select a member above'}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Date</label>
            <input
              type="date"
              className={styles.dateInput}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>

          <button
            className={styles.checkBtn}
            onClick={checkAvailability}
            disabled={!selectedMember || !date || loading}
          >
            {loading ? 'Checking...' : 'Check Availability'}
          </button>
        </div>

        {result && (
          <div className={`${styles.result} ${result.status === 'available' ? styles.available : styles.busy}`}>
            <p className={styles.resultName}>{result.name} — {result.role}</p>
            <p className={styles.resultStatus}>
              Status: <strong>{result.status.toUpperCase()}</strong>
            </p>
            {result.reason && <p className={styles.resultReason}>{result.reason}</p>}
            <p className={styles.resultDate}>Date: {result.requested_date}</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default App