import React, { createContext, useEffect, useRef, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { CameraView, CameraCapturedPicture } from 'expo-camera';

export const AppContext : React.Context<any> = createContext(undefined);

export interface Lintu {
    id : string,
    laji : string,
    kuvaus: string,
    aika: Date,
    sijainti: Location.LocationObject,
    kuva: string
  }

  interface DialogiData {
    laji: string;
    kuvaus: string
  }
  
  interface Kuvaustiedot {
    kuva? : CameraCapturedPicture,
    nimi? : string,
    info : string
  }

interface Props {
    children : React.ReactNode;
}


export const LintuProvider : React.FC<Props> = (props : Props) : React.ReactElement => {

    const [lajit, setLajit] = useState<Lintu[]>([]);
    const [dialogi, setDialogi] = useState<DialogiData>({laji:"", kuvaus: ""});
    const [lataa, setLataa] = useState(false);

    const [kuvaustiedot, setKuvaustiedot] = useState<Kuvaustiedot>({ info : ""});
    const [kuvaDialogi, setKuvaDialogi] = useState(false);
    const [kuvaNimi, setKuvaNimi] = useState("");
      
    const kameraRef : any = useRef<CameraView>(null);
    const [valittuLintu, setValittuLintu] = useState<Lintu | null>(null);
    const [lajiDialogi, setLajiDialogi] = useState(false);

    const [poistettavaLintu, setPoistettavaLintu] = useState<Lintu | null>(null);
    const [poistoDialogi, setPoistoDialogi] = useState(false);


    const db : SQLite.SQLiteDatabase = SQLite.openDatabaseSync("lintubongaus.db");

    db.execAsync(`
        CREATE TABLE IF NOT EXISTS lintubongaus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        laji TEXT,
        kuvaus TEXT,
        aika DATETIME DEFAULT (datetime('now')),
        sijainti TEXT,
        kuva TEXT
        );
      `);

      const lisaaLaji = async (): Promise<void> => {
        if (lataa) return;
        setLataa(true);
      
        try {
          const { laji, kuvaus } = dialogi;
      
          const location = await Location.getCurrentPositionAsync({});
          const coords = location.coords;
      
          const [osoiteData] = await Location.reverseGeocodeAsync({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
      
          const osoiteTeksti = osoiteData
            ? `${osoiteData.street || ''} ${osoiteData.name || ''}, ${osoiteData.postalCode || ''} ${osoiteData.city || ''}`
            : 'Tuntematon osoite';
      
          const sijainti = JSON.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude,
            osoite: osoiteTeksti,
          });
      
          db.runSync(
            `INSERT INTO lintubongaus (sijainti, laji, kuvaus) VALUES (?, ?, ?)`,
            sijainti,
            laji.trim(),
            kuvaus
          );
      
          haeLajit();
          setDialogi({ laji: "", kuvaus: "" });
          Alert.alert("Onnistui", "Lajin lisääminen onnistui!");
        } catch (error) {
          Alert.alert("Virhe", "Lisääminen epäonnistui. Yritä uudelleen.");
        } finally {
          setLataa(false);
        }
      };
      

      const haeLajit = () : void => {
        setLajit(db.getAllSync<Lintu>("SELECT * FROM lintubongaus"));
      }

      useEffect(() => {
        const tarkistaLupa = async () => {
          await Location.requestForegroundPermissionsAsync();
        };
        tarkistaLupa();
      }, []);
      
      useEffect(() => {
        haeLajit();
      }, []);

      const otaKuva = async () : Promise<void> => {
        if (!kameraRef.current) {
          Alert.alert("Kamera ei ole valmis");
          return;
        }
      
        setKuvaustiedot({
          ...kuvaustiedot,
          info : "Odota hetki..."
        });
      
        const kuva: CameraCapturedPicture = await kameraRef.current.takePictureAsync();
      
        setKuvaustiedot({
          ...kuvaustiedot,
          kuva: kuva,
          nimi: "",
          info: ""
        });
      
        setKuvaDialogi(true);
      };

      const paivitaKuva = async (laji: string, kuvaUri: string): Promise<void> => {
        if (lataa) return;
        setLataa(true);
      
        try {
          db.runSync(
            `UPDATE lintubongaus SET kuva = ? WHERE laji = ?`,
            kuvaUri,
            laji
          );
      
          haeLajit();
          Alert.alert("Onnistui", "Kuvan lisääminen onnistui!");
        } catch (error) {
          Alert.alert("Virhe", "Kuvan lisääminen epäonnistui.");
        } finally {
          setLataa(false);
        }
      };

      const poistaLaji = (id: string): void => {
        db.runSync(`DELETE FROM lintubongaus WHERE id = ?`, id);
        haeLajit();
      };      
      
      

    return(
        <AppContext.Provider value={{ 
            lajit,
            setLajit,
            dialogi,
            setDialogi,
            lisaaLaji,
            lataa,
            kuvaustiedot,
            setKuvaustiedot,
            kuvaDialogi,
            setKuvaDialogi,
            otaKuva,
            kameraRef,
            kuvaNimi,
            setKuvaNimi,
            paivitaKuva,
            valittuLintu,
            setValittuLintu,
            lajiDialogi,
            setLajiDialogi,
            poistaLaji,
            poistettavaLintu,
            setPoistettavaLintu,
            poistoDialogi,
            setPoistoDialogi

        }}>
        {props.children}
        </AppContext.Provider>
    )
}