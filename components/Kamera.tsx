import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Appbar, Button, Dialog, Portal, Text, TextInput, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Alert } from 'react-native';


const Kamera : React.FC = () : React.ReactElement => {

        const { kuvaustiedot, setKuvaustiedot, kuvaDialogi, setKuvaDialogi, otaKuva, kameraRef, kuvaNimi, setKuvaNimi, paivitaKuva } = useContext(AppContext);

        const [kameraLupa, pyydaKameraLupa] = useCameraPermissions();

        if (!kameraLupa) {
          return <Text>Tarkistetaan kameran lupaa...</Text>;
        }
        
        if (!kameraLupa.granted) {
          return (
            <View style={{ padding: 20 }}>
              <Text>Kameran käyttöoikeutta ei ole. Tarvitaan lupa kameran käyttöön.</Text>
              <Button onPress={pyydaKameraLupa}>Anna lupa</Button>
            </View>
          );
        }
    
    return(
        <>
    <Appbar.Header>
        <Appbar.Content title="Lisää lajista kuva"/>          
    </Appbar.Header>
    <SafeAreaView style={styles.container}>
      <CameraView ref={kameraRef} style={{flex: 1}}>

        {(Boolean(kuvaustiedot.info)) 
        ? <Text>{kuvaustiedot.info}</Text>
        : null
        }

        </CameraView>
        {kuvaustiedot.kuvaustila}
        
        <FAB 
        style={styles.button}
        icon="camera"
        label="Ota kuva"
        onPress={otaKuva}
        />

        <Portal>
        <Dialog visible={kuvaDialogi} onDismiss={()=> { setKuvaDialogi(false); setKuvaNimi("");}}>
            <Dialog.Title>Nimeä laji</Dialog.Title>
            <Dialog.Content>
            <TextInput label= "Lajin nimi" value={kuvaNimi} onChangeText={(text)=> setKuvaNimi(text)}/>
            </Dialog.Content>
            <Dialog.Actions>
            <Button onPress={async () => {
            if (!kuvaustiedot.kuva || !kuvaNimi) {
                Alert.alert("Virhe", "Kuva ja lajin nimi pitää olla määritelty");
                return;
            }
            try {
                await paivitaKuva(kuvaNimi, kuvaustiedot.kuva.uri);
                setKuvaDialogi(false);
                setKuvaNimi("");
                setKuvaustiedot({ info: "" });
            } catch (e) {
                Alert.alert("Virhe", "Tallennus epäonnistui.");
            }
            }}>
            Ok
            </Button>
            </Dialog.Actions>
        </Dialog>
        </Portal>
        </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 8,
  },
});

export default Kamera;