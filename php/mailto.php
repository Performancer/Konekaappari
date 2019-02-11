<?php
	$form = $headers = "";
	if($_SERVER["REQUEST_METHOD"] == "POST"){
		//jos etunimi kenttä on täytetty rakennetaan sähköpostin sisältö
		if(!empty($_POST['firstName'])){
            //asetetaan lomakkeessa olevat tiedot omille riveilleen sähköpostia varten
			$form = "User Feedback Form" . "\r\n\r\nFirst name: " . $_POST['firstName']  . "\r\nLast name: " . $_POST['lastName'] . "\r\nAge: " . $_POST['age'] . "\r\nGender: " . $_POST['gender'] . "\r\nUsage: " . $_POST['usage'] . "\r\nFunctionality: " . $_POST['functionality'] . "\r\nState: ";
			//käydään läpi lomakkeen viimeisessä kohdassa oleva monivalinta, joka on array-muodossa
			if(!empty($_POST['improve'])){
                $N = count($_POST['improve']);
                //lisätään arrayn sisältämät arvot formin jatkoksi
                for($i=0; $i < $N; $i++){
                    if($i == ($N - 1)){
                        $form .= $_POST['improve'][$i];
                    }else{
                        $form .= $_POST['improve'][$i] . ", ";
                    }
                }
			}
			//lähetetään lomake sähköposti viestinä pahaa aavistamattomalle uhrille
			mail("ronik@metropolia.fi","Torsti on PARAS!!!",$form);
			//Kiitetään asiakasta palautteesta
			echo "<script type='text/javascript'>alert('Kiitos! Palautteenne on otettu vastaan. Voitte sulkea tämän välilehden, ja pääsette takaisin konekaapparin sivustolle')</script>";
		} else {
			echo "<script type='text/javascript'>alert('Lomakkeen lähetys epäonnistui! Olethan täyttänyt nimesi oikeaan kenttään?')</script>";
		}
	}
?>