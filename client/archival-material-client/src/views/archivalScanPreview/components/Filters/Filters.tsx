import { Slider } from "primereact/slider";
import styles from "./Filters.module.scss";
import { useOpenSeadragonContext } from "../../../../context/OpenSeadragonContext";
import { useOpenSeadragonFilters } from "../../../../hooks/useOpenSeaDragonFilters/useOpenSeaDragonFilters";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import DrawToolEnum from "../../../../models/DrawToolEnum";
import ColorPicker from "../ColorPicker/ColorPicker";
import { useState } from "react";


enum FilterTab {
    FILTERS,
    COLORS
}

const Filters: React.FC = () => {

    const [activeTab, setActiveTab] = useState<FilterTab>(FilterTab.FILTERS)

    const {
        rotation,
        rotate,
        activeTool,
        drawingFontSize,
        setDrawingFontSize,
        highlightingFontSize,
        setHighlightingFontSize,
        highlighterPresets,
        highlightColor,
        setHighlightColor,
        drawPresets,
        drawColor,
        setDrawColor,
        textboxTextPresets,
        textboxTextColor,
        textboxBackgroundPresets,
        textboxBackgroundColor,
        setTextboxTextColor,
        setTextboxBackgroundColor,
    } = useOpenSeadragonContext();

    const {
        brightness,
        setBrightness,
        contrast,
        setContrast,
        saturation,
        setSaturation,
        hueRotation,
        setHueRotation,
        grayscale,
        setGrayscale,
        invert,
        setInvert,
        sepia,
        setSepia,
        resetFilters
    } = useOpenSeadragonFilters();



    const displayColor = activeTool === DrawToolEnum.DRAW || activeTool === DrawToolEnum.HIGHLIGHT || activeTool === DrawToolEnum.TYPE

    let content = <></>

    if (activeTab == FilterTab.FILTERS) {
        content =
            <>
                <h2 className={`${styles.header}`}>Filtry</h2>

                <p>Jas {brightness}%</p>
                <Slider min={0} max={300} value={brightness} onChange={(e) => setBrightness(e.value)} />

                <p>Kontrast {contrast}%</p>
                <Slider min={0} max={300} value={contrast} onChange={(e) => setContrast(e.value)} />

                <p>Saturace {saturation}%</p>
                <Slider min={0} max={300} value={saturation} onChange={(e) => setSaturation(e.value)} />

                <p>Otočení odstínu {hueRotation}°</p>
                <Slider min={0} max={360} value={hueRotation} onChange={(e) => setHueRotation(e.value)} />

                <p>Odstíny šedi {grayscale}%</p>
                <Slider min={0} max={100} value={grayscale} onChange={(e) => setGrayscale(e.value)} />

                <p>Převrácení barev {invert}%</p>
                <Slider min={0} max={100} value={invert} onChange={(e) => setInvert(e.value)} />

                <p>Sepia {sepia}%</p>
                <Slider min={0} max={100} value={sepia} onChange={(e) => setSepia(e.value)} />

                <p>Rotace snímku {rotation}°</p>
                <Slider min={0} max={360} value={rotation} onChange={(e) => rotate(e.value)} style={{ color: "red" }} />
                <div className={`${styles.resetFiltersWrapper}`}>
                    <Button label="Resetovat filtry" onClick={resetFilters} className={`${styles.button}`} />
                </div>
            </>
    }
    else if (activeTab == FilterTab.COLORS) {
        content = <>
            <h2 className={`${styles.header}`}>Barvy</h2>
            {activeTool === DrawToolEnum.DRAW &&
                <>
                    <p>Velikost štětce</p>
                    <InputNumber min={1} value={drawingFontSize} onChange={(e) => setDrawingFontSize(e.value)} inputStyle={{ width: '80px' }} showButtons />
                    <ColorPicker presets={drawPresets} setter={setDrawColor} value={drawColor}/>
                </>
            }
            {activeTool === DrawToolEnum.HIGHLIGHT &&
                <>
                    <p>Velikost štětce</p>
                    <InputNumber min={1} value={highlightingFontSize} onChange={(e) => setHighlightingFontSize(e.value)} inputStyle={{ width: "80px" }} showButtons />
                    <ColorPicker presets={highlighterPresets} setter={setHighlightColor} value={highlightColor}/>
                </>
            }
            {activeTool === DrawToolEnum.TYPE &&
                <>
                    <p>Barva pozadí</p>
                    <ColorPicker presets={textboxBackgroundPresets} setter={setTextboxBackgroundColor} value={textboxBackgroundColor}/>
                    <p>Barva textu</p>
                    <ColorPicker presets={textboxTextPresets} setter={setTextboxTextColor} value={textboxTextColor}/>
                </>
            }

        </>
    }


    return (
        <>
            <div className={`${styles.filterContainer}`}>
                <div>
                    <Button label="Filtry" onClick={() => setActiveTab(FilterTab.FILTERS)} className={`${activeTab == FilterTab.FILTERS ? styles.button : styles.buttonInverse}`} style={{ width: "47%", marginLeft: "6%" }} />
                    {displayColor &&
                        <Button label="Barvy" onClick={() => setActiveTab(FilterTab.COLORS)} className={`${activeTab == FilterTab.COLORS ? styles.button : styles.buttonInverse}`} style={{ width: "47%" }} />
                    }

                </div>

                {content}
            </div>
        </>
    )
}

export default Filters;