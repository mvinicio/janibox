import React, { useState } from 'react';

interface DeliveryScheduleProps {
  onBack: () => void;
  onConfirm: () => void;
}

const DeliverySchedule: React.FC<DeliveryScheduleProps> = ({ onBack, onConfirm }) => {
  const today = new Date();
  
  const [address, setAddress] = useState('123 Calle de las Flores, Ciudad Jardín');
  const [sameDay, setSameDay] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('morning');
  // Initialize with today's date
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [isLocating, setIsLocating] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapUrl, setMapUrl] = useState('');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);

  const days = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  // Calculate calendar data dynamically
  const currentMonthName = today.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const formattedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);
  
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay(); // 0 is Sunday

  // Create padding for days before the 1st of the month
  const emptySlots = Array.from({ length: startDay }, (_, i) => i);
  // Create array for actual days
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      alert("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLocating(true);
    setAddress("Identificando calle...");
    setShowMap(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        
        // Use a higher zoom level (z=17) to show streets clearly
        const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`;
        setMapUrl(embedUrl);

        try {
          // Fetch address details in Spanish
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'Accept-Language': 'es-ES,es;q=0.9' 
                }
            }
          );
          const data = await response.json();

          if (data && data.address) {
            const addr = data.address;
            
            // Priority list for finding a readable street name
            const street = addr.road || addr.street || addr.pedestrian || addr.path || addr.residential || addr.lane || addr.service;
            const number = addr.house_number;
            const neighborhood = addr.neighbourhood || addr.suburb || addr.city_district || addr.quarter;
            const city = addr.city || addr.town || addr.village;
            const poi = data.name; 

            let finalAddress = "";

            if (street) {
                finalAddress = street;
                if (number) finalAddress += ` #${number}`;
                if (neighborhood) finalAddress += `, ${neighborhood}`;
            } else if (poi) {
                finalAddress = poi;
                if (neighborhood) finalAddress += `, ${neighborhood}`;
            } else if (neighborhood) {
                finalAddress = neighborhood;
                if (city) finalAddress += `, ${city}`;
            } else {
                finalAddress = data.display_name ? data.display_name.split(',').slice(0, 3).join(',') : '';
            }

            if (!finalAddress.trim()) {
                finalAddress = "Ubicación marcada en el mapa";
            }

            setAddress(finalAddress);
          } else {
            setAddress("Ubicación marcada en el mapa");
          }
        } catch (error) {
          console.error("Error en geocodificación:", error);
          setAddress("Ubicación marcada en el mapa");
        } finally {
          setIsLocating(false);
          setShowMap(true);
        }
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
        setAddress(""); 
        let errorMsg = "No pudimos acceder a tu ubicación.";
        if (error.code === 1) errorMsg = "Permiso de ubicación denegado.";
        
        alert(`${errorMsg} Por favor ingrésala manualmente.`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-white dark:bg-[#1a0e10] animate-in fade-in slide-in-from-right-10 duration-300 font-display">
      {/* TopAppBar */}
      <div className="flex items-center bg-white dark:bg-[#1a0e10] p-4 pb-2 justify-between sticky top-0 z-10 border-b border-[#f4f0f1] dark:border-[#2d1a1d]">
        <button onClick={onBack} className="text-[#171112] dark:text-white flex size-12 shrink-0 items-center justify-start cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
          Programar Entrega
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Section: Delivery Address */}
        <div className="pt-4">
          <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2">
            Dirección de Entrega
          </h3>
          <div className="flex flex-col px-4 py-3 gap-3">
            <label className="flex flex-col w-full">
              <div className={`flex w-full items-center rounded-xl shadow-sm transition-all border bg-white dark:bg-[#2d1a1d] overflow-hidden ${
                  isLocating ? 'opacity-80' : ''
                } focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 border-[#e5dcdd] dark:border-[#3d2a2d]`}>
                
                <input 
                  className="flex w-full min-w-0 flex-1 resize-none bg-transparent border-none focus:ring-0 h-14 placeholder:text-[#87646a] px-[15px] text-base font-normal leading-normal text-[#171112] dark:text-white disabled:cursor-not-allowed" 
                  placeholder="Calle principal, Número, Barrio..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isLocating}
                />
                
                <button 
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="flex items-center justify-center px-4 h-14 text-primary hover:bg-primary/5 transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100 outline-none"
                  title="Usar mi ubicación GPS"
                >
                  <span className={`material-symbols-outlined ${isLocating ? 'animate-spin' : ''}`}>
                    {isLocating ? 'refresh' : 'my_location'}
                  </span>
                </button>
              </div>
            </label>

            {/* Map Preview */}
            {showMap && (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="rounded-xl overflow-hidden h-48 relative w-full border border-gray-200 dark:border-gray-700 shadow-sm group">
                  <iframe
                    title="Ubicación de entrega"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={mapUrl}
                    className="absolute inset-0 grayscale-[0.1]"
                  ></iframe>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none drop-shadow-md pb-4">
                     <span className="material-symbols-outlined text-4xl text-primary filled">location_on</span>
                  </div>
                </div>
                
                {coords && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-white dark:bg-[#2d1a1d] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-[#171112] dark:text-white py-3 rounded-xl transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-primary">map</span>
                    <span className="text-sm font-bold">Ver en Google Maps</span>
                    <span className="material-symbols-outlined text-gray-400 text-sm ml-auto">open_in_new</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ListItem: Same-day delivery Toggle */}
        <div className="my-2">
          <div className="flex items-center gap-4 bg-white dark:bg-[#1a0e10] px-4 min-h-[64px] justify-between border-y border-[#f4f0f1] dark:border-[#2d1a1d]">
            <div className="flex items-center gap-4">
              <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-10">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div>
                <p className="text-[#171112] dark:text-white text-base font-semibold leading-none">Entrega el mismo día</p>
                <p className="text-[#87646a] text-xs mt-1">Ordena antes de las 2 PM para hoy</p>
              </div>
            </div>
            <div className="shrink-0">
              <label className="relative flex h-[31px] w-[51px] cursor-pointer items-center rounded-full border-none bg-[#f4f0f1] dark:bg-[#3d2a2d] p-0.5 has-[:checked]:justify-end has-[:checked]:bg-primary transition-all duration-200">
                <div className="h-full w-[27px] rounded-full bg-white shadow-md"></div>
                <input 
                  type="checkbox" 
                  checked={sameDay} 
                  onChange={() => setSameDay(!sameDay)} 
                  className="invisible absolute" 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section: Calendar Picker */}
        <div className="pt-4 px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Seleccionar Fecha
            </h3>
            <div className="flex gap-4 text-[#87646a] items-center">
              <span className="material-symbols-outlined cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-sm p-1">chevron_left</span>
              <span className="text-sm font-semibold text-[#171112] dark:text-white">{formattedMonth}</span>
              <span className="material-symbols-outlined cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors text-sm p-1">chevron_right</span>
            </div>
          </div>
          <div className="bg-background-light/50 dark:bg-[#2d1a1d] p-4 rounded-xl border border-[#f4f0f1] dark:border-[#3d2a2d]">
            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              {days.map(d => (
                <div key={d} className="text-[10px] font-bold text-[#87646a] uppercase">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
               {/* Padding for start of month */}
               {emptySlots.map(d => (
                 <div key={`empty-${d}`} className="p-2"></div>
               ))}
               
               {/* Actual Days */}
               {monthDays.map(d => (
                 <div 
                   key={d} 
                   onClick={() => setSelectedDate(d)}
                   className={`p-2 text-sm rounded-full cursor-pointer transition-all active:scale-95 flex items-center justify-center aspect-square ${
                     selectedDate === d 
                        ? 'bg-primary text-white font-bold shadow-md shadow-primary/30' 
                        : 'text-[#171112] dark:text-white hover:bg-primary/10'
                   } ${
                     // Highlight today with a border if not selected
                     d === today.getDate() && selectedDate !== d ? 'ring-1 ring-primary text-primary font-bold' : ''
                   }`}
                 >
                   {d}
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Section: Time Slots */}
        <div className="pt-6 px-4">
          <h3 className="text-[#171112] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3">
            Horario de Entrega
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'morning', label: 'Mañana', time: '9:00 AM - 12:00 PM', icon: 'wb_twilight' },
              { id: 'afternoon', label: 'Tarde', time: '12:00 PM - 4:00 PM', icon: 'light_mode' },
              { id: 'evening', label: 'Noche', time: '4:00 PM - 8:00 PM', icon: 'dark_mode' }
            ].map((slot) => (
              <div 
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all active:scale-[0.99] ${
                  selectedSlot === slot.id 
                    ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-1 ring-primary' 
                    : 'border-[#e5dcdd] dark:border-[#3d2a2d] bg-white dark:bg-[#2d1a1d] hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${selectedSlot === slot.id ? 'text-primary' : 'text-[#87646a]'}`}>
                    {slot.icon}
                  </span>
                  <div>
                    <p className="text-[#171112] dark:text-white font-bold">{slot.label}</p>
                    <p className="text-[#87646a] text-sm">{slot.time}</p>
                  </div>
                </div>
                <div className={`size-6 rounded-full border-2 flex items-center justify-center ${selectedSlot === slot.id ? 'border-primary' : 'border-[#e5dcdd] dark:border-[#3d2a2d]'}`}>
                  {selectedSlot === slot.id && <div className="size-3 bg-primary rounded-full animate-in zoom-in duration-200"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Footer Action */}
      <div className="fixed bottom-0 w-full max-w-[500px] p-4 bg-white/80 dark:bg-[#1a0e10]/80 backdrop-blur-md border-t border-[#f4f0f1] dark:border-[#2d1a1d] z-50">
        <button 
          onClick={onConfirm}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <span>Confirmar Entrega</span>
          <span className="material-symbols-outlined text-base">check_circle</span>
        </button>
      </div>
    </div>
  );
};

export default DeliverySchedule;