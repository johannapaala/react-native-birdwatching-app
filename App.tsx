import React from 'react';
import { LintuProvider } from './context/AppContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, BottomNavigation } from 'react-native-paper';

import Paanakyma from './components/Paanakyma';
import Kamera from './components/Kamera';
import Lomake from './components/Lomake'


export default function App() {

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'main', title: 'Päänäkymä', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
    { key: 'lomake', title: 'Lomake', focusedIcon: 'note-plus', unfocusedIcon: 'note-plus-outline' },
    { key: 'kamera', title: 'Kamera', focusedIcon: 'camera', unfocusedIcon: 'camera-outline'},
  ]);


  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'main':
        return <Paanakyma />;
      case 'kamera':
        return index === 2 ? <Kamera /> : null;
      case 'lomake':
        return <Lomake />;
      default:
        return null;
    }
  };

    return (
      <SafeAreaProvider>
        <PaperProvider>
          <LintuProvider>
              <BottomNavigation
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                sceneAnimationEnabled={true}
              />
          </LintuProvider>
        </PaperProvider>
      </SafeAreaProvider>
    );
}
