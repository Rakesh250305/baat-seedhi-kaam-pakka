import './App.css'
import Button from './components/Button'

function App() {
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center px-4 gap-10">
      <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white text-center">
        Baat Seedhi Kaam Pakka
      </h1>

      <div className="flex flex-row gap-6 lg:gap-12">
        <Button name="सड़क की समस्या" subtitle="Sadak Ki Samasya" />
        <Button name="बिजली की समस्या" subtitle="Bijli Ki Samasya" />
      </div>
    </div>
  )
}

export default App