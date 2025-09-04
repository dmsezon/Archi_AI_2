
import React from 'react';

const TIPS = [
  // Wskazówki Architektoniczne
  "Ciepłe oświetlenie zewnętrzne dodaje przytulności po zmroku.",
  "Połączenie drewna i betonu to popularny trend w nowoczesnej architekturze.",
  "Pamiętaj o roślinności! Zieleń ożywia każdą wizualizację.",
  "Ciemny dach dobrze komponuje się z jasną elewacją, tworząc elegancki kontrast.",
  "Duże przeszklenia otwierają dom na ogród i wpuszczają więcej światła.",
  "Zasada trójpodziału sprawdza się nie tylko w fotografii, ale i w projektowaniu elewacji.",
  "Dobór odpowiedniej barwy światła potrafi całkowicie odmienić nastrój wizualizacji.",
  "Pamiętaj, że otoczenie domu jest równie ważne, co sam budynek.",
  "Materiały o różnej fakturze dodają głębi i charakteru projektowi.",
  "Minimalizm nie oznacza nudy. Kluczem jest dbałość o detal.",
  "Zastanów się nad ścieżkami w ogrodzie. Prowadzą wzrok i tworzą naturalne przejścia.",
  "Dach to piąta elewacja. Jego forma i kolor mają ogromny wpływ na wygląd całości.",
  "Spójność kolorystyczna między stolarką okienną, drzwiami a dachem tworzy harmonijny wygląd.",
  
  // Wskazówki Humorystyczne
  "Wzmacnianie fundamentów... mocną kawą.",
  "Ustawianie gnomów ogrodowych na strategicznych pozycjach.",
  "Sprawdzanie, czy wirtualne rury nie przeciekają.",
  "Negocjowanie z wirtualną ekipą budowlaną o terminach.",
  "Polerowanie wirtualnych szyb. Uważaj na odciski palców!",
  "Sadzenie cyfrowych drzew. Spokojnie, żadnej ziemi za paznokciami.",
  "Wybieranie idealnego odcienia bieli. To trudniejsze niż myślisz.",
  "Ukrywanie małej, gumowej kaczuszki w modelu 3D. Powodzenia w szukaniu!",
  "Symulowanie realistycznej pogody. Miejmy nadzieję na słońce.",
  "Zwiększanie wartości nieruchomości... cyfrowo.",
  "Architekt AI właśnie pije wirtualną herbatę. Chwila cierpliwości.",
  "Generowanie realistycznych rachunków za prąd... Na szczęście tylko wirtualnych.",
  "Dodawanie sąsiada, który zawsze kosi trawnik o 7 rano.",
  "Retikulacja krzywych... i krawężników.",
  "Karmienie wirtualnych gołębi na dachu.",
  "Upewniamy się, że wirtualny komin działa poprawnie. Ho ho ho!",
  "Malowanie płotu. Tomkowi Sawyerowi by się spodobało.",
  "Projektowanie idealnego miejsca na grilla. To priorytet!",
  "Sprawdzanie nośności cyfrowego stropu. Lepiej dmuchać na zimne.",
  "Konsultowanie projektu z wirtualnym kotem. Mruknął z aprobatą."
];

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];

  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      <p className="text-white text-xl mt-4 font-semibold">{message}</p>
      <p className="text-gray-400 text-sm mt-2 max-w-xs text-center">{randomTip}</p>
    </div>
  );
};

export default LoadingOverlay;
