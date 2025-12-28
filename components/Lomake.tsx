import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Appbar, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet } from 'react-native';


const Lomake : React.FC = () : React.ReactElement => {

    const { dialogi, setDialogi, lisaaLaji, lataa } = useContext(AppContext);
    

    return(
      <>
      <Appbar.Header>
        <Appbar.Content title="Lisää uusi laji"/>          
      </Appbar.Header>
      <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TextInput style={styles.input}
              label="Linnun laji"
              mode="outlined"
              placeholder="Kirjoita linnun laji"
              value={dialogi.laji}
              onChangeText={ (uusiLaji : string) => setDialogi({...dialogi, laji: uusiLaji})}
            />
            <TextInput style={styles.input}
              label="Kuvaus"
              mode="outlined"
              placeholder="Kirjoita kuvausteksti"
              value={dialogi.kuvaus}
              onChangeText={ (uusiKuvaus : string) => setDialogi({...dialogi, kuvaus: uusiKuvaus})}
            />
            {lataa ? (
              <ActivityIndicator size="large" style={{ marginTop: 16 }} />
            ) : (
              <Button
                mode="contained"
                style={styles.button}
                onPress={lisaaLaji}
                disabled={lataa}
              >
                Lisää laji
              </Button>
            )}
          </ScrollView>
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


export default Lomake;