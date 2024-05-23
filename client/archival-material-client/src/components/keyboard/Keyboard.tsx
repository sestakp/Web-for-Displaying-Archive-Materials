/**
 * CITE https://www.geeksforgeeks.org/virtual-keyboard-using-react/
 * Last updated: 15 Sep, 2023
 * 
 */


// keyboard.js 
import React, { useState } from 'react'; 
import styles from "./keyboard.module.scss"
import logger from '../../utils/loggerUtil';
import { Tooltip } from 'primereact/tooltip';


export default function Keyboard() { 

	const specialKeys = {} as any;

	specialKeys['<'] = "Předchozí snímek archiválie"
	specialKeys['>'] = "Následující snímek archiválie"
	specialKeys['H'] = "Zobrazit nápovědu"
	specialKeys['Q'] = "Otočit snímek vlevo"
	specialKeys['E'] = "Otočit snímek vpravo"
	specialKeys['F'] = "Přepnutí zobrazení na celou obrazovku"
	specialKeys['_.-'] = "Oddálit snímek"
	specialKeys['+.='] = "Přiblížit snímek"
	specialKeys['Del'] = "Smazat vybranou poznámku"
	specialKeys['L'] = "Přepnutí zachování zobrazení"
	specialKeys['O'] = "Přepnutí zobrazení poznámek"
	specialKeys['W'] = "Pohyb po archiválii nahoru"
	specialKeys['A'] = "Pohyb po archiválii vlevo"
	specialKeys['D'] = "Pohyb po archiválii vpravo"
	specialKeys['S'] = "Pohyb po archiválii dolů"
	specialKeys['S'] = "Pohyb po archiválii dolů"
	specialKeys['Esc'] = "Přepnutí do režimu pohybu po archiválii"

	


	function getHighlightClass(keyValue: string): string{
		return specialKeys[keyValue] !== undefined ? `${styles.highlightedKey}` : ""
	}


	return ( 
		<div className={`${styles.keyboard}`}> 
			<div className={`${styles.keyboardcontainer}`}> 
				<div className={`${styles.container}`}> 
					<div className={`${styles.row}`}> 
						{['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 
						'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'] 
						.map((keyvalue, index) => 
						( 
							<>
							<Tooltip target={`.k1_${index}`} content={specialKeys[keyvalue]} />
							<div key={keyvalue} className={`${"k1_"+index} ${styles.key} ${getHighlightClass(keyvalue)}`}
								> 
								{keyvalue.includes('.') ? ( 
									keyvalue.split('.').map((part, index) => ( 
										<span key={index}>{part}</span> 
									)) 
								) : ( 
									keyvalue === 
									'<i className="fa-solid fa-delete-left"></i>'
									? ( 
										<i className="fa-solid fa-delete-left"></i> 
									) : ( 
										<span>{keyvalue}</span> 
									) 
								)} 
							</div> 
							</>
						))} 
					</div> 
					<div className={`${styles.row}`}> 
						{['~.`', '!.1', '@.2', '#.3', '$.4', '%.5', 
						'^.6', '&.7', '*.8', '(.9', ').0', '_.-', '+.=', 
						'←'] 
						.map((keyvalue, index) => 
						( 
							<>
							<Tooltip target={`.k2_${index}`} content={specialKeys[keyvalue]} />
							<div key={keyvalue} className={`${"k2_"+index} ${styles.key} ${getHighlightClass(keyvalue)}`}
								> 
								{keyvalue.includes('.') ? ( 
									keyvalue.split('.').map((part, index) => ( 
										<span key={index}>{part}</span> 
									)) 
								) : ( 
									keyvalue === 
									'<i className="fa-solid fa-delete-left"></i>'
									? ( 
										<i className="fa-solid fa-delete-left"></i> 
									) : ( 
										<span>{keyvalue}</span> 
									) 
								)} 
							</div> 
							</>
						))} 
					</div> 
					<div className={`${styles.row}`}> 
						{['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 
						'U', 'I', 'O', 'P', '{_[', '}_]', '|_\\', 'Del'] 
						.map((keyvalue, index) => ( 
							<>
							<Tooltip target={`.k3_${index}`} content={specialKeys[keyvalue]} />
							<div key={keyvalue} className={`${"k3_"+index} ${styles.key} ${getHighlightClass(keyvalue)}`}
								> 
								{keyvalue.includes('_') ? ( 
									keyvalue.split('_').map((part, index) => ( 
										<span key={index}>{part}</span> 
									)) 
								) : ( 
									<span>{keyvalue}</span> 
								)} 
								
								
							</div> 
							</>
						))} 
					</div> 
					<div className={`${styles.row}`}> 
						{['Caps Lock', 'A', 'S', 'D', 'F', 'G', 'H', 
						'J', 'K', 'L', ':_;', `"_'`, 'Enter'] 
							.map((keyvalue,index) => ( 
							<>
							<Tooltip target={`.k4_${index}`} content={specialKeys[keyvalue]} />
							<div key={keyvalue} className={`${"k4_"+index} ${styles.key} ${getHighlightClass(keyvalue)}`}
								> 
								{keyvalue.includes('_') ? ( 
									keyvalue.split('_').map((part, index) => ( 
										<span key={index}>{part}</span> 
									)) 
								) : ( 
									<span>{keyvalue}</span> 
								)} 
							</div> 
							</>
						))} 
					</div> 
					<div className={`${styles.row}`}> 
						{['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 
						'<_,', '>_.', '?_/', 'Shift'].map((keyvalue, index) => ( 
							<>
							<Tooltip target={`.k5_${index}`} content={specialKeys[keyvalue]} />
							<div key={index} className={`${"k5_"+index} ${styles.key} ${getHighlightClass(keyvalue)}`}
								> 
								{keyvalue.includes('_') ? ( 
									keyvalue.split('_').map((part, index) => ( 
										<span key={index}>{part}</span> 
									)) 
								) : ( 
									<span>{keyvalue}</span> 
								)} 
							</div> 
							</>
						))} 
					</div> 
					<div className={`${styles.row}`}> 
						{['Ctrl', 'Alt', ' ', 'Ctrl', 'Alt', '<', '>'] 
							.map((keyvalue, index) => ( 
								<>
								<Tooltip target={`.k6_${index}`} content={specialKeys[keyvalue]} />
								<div key={index} className={`${"k6_"+index} ${styles.key} ${getHighlightClass(keyvalue)}`}> 
								<span>{keyvalue}</span> 
							</div> 
							</>
						))} 
					</div> 
				</div> 
			</div> 
		</div> 
	) 
} 
