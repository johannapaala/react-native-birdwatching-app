import React, { useContext } from 'react';
import { Appbar, Button, Dialog, List, Portal, Text, IconButton } from 'react-native-paper';
import { AppContext, Lintu } from '../context/AppContext';
import { ScrollView, Image } from 'react-native';


const Paanakyma : React.FC = () : React.ReactElement => {

    const { lajit, valittuLintu, setValittuLintu, lajiDialogi, setLajiDialogi, poistaLaji, poistettavaLintu, setPoistettavaLintu, poistoDialogi, setPoistoDialogi } = useContext(AppContext);

    return(
        <>
        <Appbar.Header>
          <Appbar.Content title="Bongatut linnut"/>
        </Appbar.Header>
          <ScrollView style={{padding: 20}}>
          {(lajit.length > 0)
            ? [...lajit]
                .sort((a, b) => a.laji.localeCompare(b.laji, 'fi'))
                .map((lintu: Lintu) => {
                return (
                  <List.Item
                    title={`${lintu.laji}, ${new Date(lintu.aika).toLocaleDateString('fi-FI')} klo ${new Date(lintu.aika).toLocaleTimeString('fi-FI', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`}
                    description={lintu.kuvaus}
                    key={lintu.id}
                    onPress={() => {
                        setValittuLintu(lintu);
                        setLajiDialogi(true);
                      }}
                      right={props => (
                        <IconButton
                          {...props}
                          icon="delete"
                          onPress={() => {
                            setPoistettavaLintu(lintu);
                            setPoistoDialogi(true);
                          }}
                        />
                      )}
                  />
                );
              })
            : <Text>Ei vielä bongattuja lintuja</Text>
            }

            <Portal>
            <Dialog visible={lajiDialogi} onDismiss={() => setLajiDialogi(false)}>
                <Dialog.Title>{valittuLintu?.laji}</Dialog.Title>
                <Dialog.Content>
                <Text>Kuvaus: {valittuLintu?.kuvaus}</Text>
                <Text>Ajankohta: {valittuLintu ? `${new Date(valittuLintu.aika).toLocaleDateString('fi-FI')} klo ${new Date(valittuLintu.aika).toLocaleTimeString('fi-FI', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}`
                    : ''}
                </Text>
                <Text>Sijainti: {valittuLintu ? JSON.parse(valittuLintu.sijainti).osoite : ''}</Text>
                {valittuLintu?.kuva &&
                    <Image source={{ uri: valittuLintu.kuva }} style={{ width: "100%", height: 300, marginTop: 10 }} />}
                </Dialog.Content>
                <Dialog.Actions>
                <Button onPress={() => setLajiDialogi(false)}>Sulje</Button>
                </Dialog.Actions>
            </Dialog>
            </Portal>
            <Portal>
            <Dialog visible={poistoDialogi} onDismiss={() => setPoistoDialogi(false)}>
                <Dialog.Title>Vahvista poisto</Dialog.Title>
                <Dialog.Content>
                <Text>Haluatko varmasti poistaa lajin {poistettavaLintu?.laji}?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                <Button onPress={() => setPoistoDialogi(false)}>Peruuta</Button>
                <Button
                    onPress={() => {
                    if (poistettavaLintu) {
                        poistaLaji(poistettavaLintu.id);
                        setPoistettavaLintu(null);
                        setPoistoDialogi(false);
                    }
                    }}
                >
                    Poista
                </Button>
                </Dialog.Actions>
            </Dialog>
            </Portal>
          </ScrollView>
        </>
    )
}

export default Paanakyma;