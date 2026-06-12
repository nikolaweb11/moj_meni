import { useState } from 'react'
import { Save, Check } from 'lucide-react'
import useStore from '../store/useStore'

const inp = 'border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white placeholder-slate-400 w-full'

function PersonDocs({ label, person, tripId, data }) {
  const updateDocuments = useStore((s) => s.updateDocuments)
  const [form, setForm] = useState({
    name: data.name || '',
    passportNumber: data.passportNumber || '',
    passportExpiry: data.passportExpiry || '',
    visaRequired: data.visaRequired || false,
    visaStatus: data.visaStatus || '',
    visaExpiry: data.visaExpiry || '',
    insurance: {
      company: data.insurance?.company || '',
      policyNumber: data.insurance?.policyNumber || '',
      phone: data.insurance?.phone || '',
      coverage: data.insurance?.coverage || '',
    },
    vaccinations: data.vaccinations || '',
    driverLicense: data.driverLicense || '',
    emergencyContact: data.emergencyContact || '',
    emergencyPhone: data.emergencyPhone || '',
  })
  const [saved, setSaved] = useState(false)

  const save = () => {
    updateDocuments(tripId, person, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800">{label}</h3>
        <button onClick={save} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${saved ? 'bg-green-100 text-green-700' : 'bg-rose-500 text-white hover:bg-rose-600'}`}>
          {saved ? <><Check size={13} /> Sačuvano</> : <><Save size={13} /> Sačuvaj</>}
        </button>
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block font-medium">Ime i prezime</label>
        <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Kao u pasošu" className={inp} />
      </div>

      <div className="bg-blue-50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider">📔 Pasoš</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Broj pasoša</label>
            <input type="text" value={form.passportNumber} onChange={(e) => setForm((f) => ({ ...f, passportNumber: e.target.value }))} placeholder="npr. B 123456" className={inp} />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Važi do</label>
            <input type="date" value={form.passportExpiry} onChange={(e) => setForm((f) => ({ ...f, passportExpiry: e.target.value }))} className={inp} />
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 mb-1 block">Vozačka dozvola (broj)</label>
          <input type="text" value={form.driverLicense} onChange={(e) => setForm((f) => ({ ...f, driverLicense: e.target.value }))} placeholder="Opciono" className={inp} />
        </div>
      </div>

      <div className="bg-amber-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">🛂 Viza</p>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input type="checkbox" checked={form.visaRequired} onChange={(e) => setForm((f) => ({ ...f, visaRequired: e.target.checked }))} className="rounded" />
            Potrebna viza
          </label>
        </div>
        {form.visaRequired && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Status vize</label>
              <select value={form.visaStatus} onChange={(e) => setForm((f) => ({ ...f, visaStatus: e.target.value }))} className={inp}>
                <option value="">— odaberi —</option>
                <option>Nije aplicirana</option>
                <option>U procesu</option>
                <option>Odobrena</option>
                <option>Odbijena</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Važi do</label>
              <input type="date" value={form.visaExpiry} onChange={(e) => setForm((f) => ({ ...f, visaExpiry: e.target.value }))} className={inp} />
            </div>
          </div>
        )}
      </div>

      <div className="bg-green-50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-green-700 uppercase tracking-wider">🏥 Putno osiguranje</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Kompanija</label>
            <input type="text" value={form.insurance.company} onChange={(e) => setForm((f) => ({ ...f, insurance: { ...f.insurance, company: e.target.value } }))} placeholder="npr. Generali" className={inp} />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Broj polise</label>
            <input type="text" value={form.insurance.policyNumber} onChange={(e) => setForm((f) => ({ ...f, insurance: { ...f.insurance, policyNumber: e.target.value } }))} placeholder="Broj police" className={inp} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Telefon za hitne slučajeve</label>
            <input type="tel" value={form.insurance.phone} onChange={(e) => setForm((f) => ({ ...f, insurance: { ...f.insurance, phone: e.target.value } }))} placeholder="+381 11 xxx" className={inp} />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Pokrivenost</label>
            <input type="text" value={form.insurance.coverage} onChange={(e) => setForm((f) => ({ ...f, insurance: { ...f.insurance, coverage: e.target.value } }))} placeholder="npr. 50.000 EUR" className={inp} />
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block font-medium">💉 Vakcine / zdravstvene napomene</label>
        <textarea value={form.vaccinations} onChange={(e) => setForm((f) => ({ ...f, vaccinations: e.target.value }))} rows={2} placeholder="Vakcine, alergije, lekovi koje uzimate..." className={`${inp} resize-none`} />
      </div>

      <div className="bg-red-50 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">🆘 Kontakt za hitne slučajeve</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Ime</label>
            <input type="text" value={form.emergencyContact} onChange={(e) => setForm((f) => ({ ...f, emergencyContact: e.target.value }))} placeholder="Roditelj, prijatelj..." className={inp} />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Telefon</label>
            <input type="tel" value={form.emergencyPhone} onChange={(e) => setForm((f) => ({ ...f, emergencyPhone: e.target.value }))} placeholder="+381 ..." className={inp} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentsSection({ trip }) {
  const couple = useStore((s) => s.couple)
  const docs = trip.documents || { person1: {}, person2: {} }

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-slate-800">📄 Dokumenti & vize</h2>
      <PersonDocs label={`📋 ${couple.name1}`} person="person1" tripId={trip.id} data={docs.person1} />
      <PersonDocs label={`📋 ${couple.name2}`} person="person2" tripId={trip.id} data={docs.person2} />
    </div>
  )
}
