import { ColorPicker as PrimeColorPicker } from 'primereact/colorpicker';
import { Button } from "primereact/button";

interface ColorPickerProps {
  presets: any,
  setter: any,
  value : any
}


const ColorPicker: React.FC<ColorPickerProps> = ({ presets, setter, value}) => {


    return(
        <div>
        <p>Vlastní barva</p>
        <PrimeColorPicker value={value} onChange={(e) => setter(e.value?.toString())} />
        <p>Předdefinované barvy</p>
        <div className="p-d-flex">
          {presets.map((color: string, index: number) => (
            <Button
              key={index}
              icon="pi pi-circle-fill"
              className={`p-button-rounded p-button-${color === value ? 'primary' : 'outlined'}`}
              onClick={() => setter(color)}
              style={{ backgroundColor: color, width: 30, height: 30 }}
            />
          ))}
        </div>
      </div>
    
    )

}

export default ColorPicker;