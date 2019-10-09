import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { string } from "prop-types";
import { TableHTMLAttributes } from "react";

export class test01 implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _container: HTMLDivElement;
	private printelem: HTMLDivElement;
	private button: HTMLButtonElement;
	private table:HTMLTableElement;
	private th:HTMLTableHeaderCellElement;
	private tr:HTMLTableRowElement;
	private tabCell:HTMLTableHeaderCellElement;
	private popupWin: Window;
	private _notifyOutputChanged: () => void;
	private printable:string;
	private testss:JSON;
	/**
	 * Empty constructor.
	 */
	constructor()
	{
	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this.button = document.createElement("button");
		// Get the localized string from localized string
		this.button.innerHTML = context.resources.getString(
		  "Print It"
		);
		this.button.classList.add("SimpleIncrement_Button_Style");
		this.button.style.backgroundColor = "Purple"; 
		this.button.style.color = "White";
		this._notifyOutputChanged = notifyOutputChanged;
		//this.button.addEventListener("click", (event) => { this._value = this._value + 1; this._notifyOutputChanged();});
		this.button.addEventListener("click", this.onButtonClick.bind(this));
		// Adding the label and button created to the container DIV.
		this.table = document.createElement("table");
		this.table.id = "table";
		this.table.border = "1";


		this.printelem = document.createElement("div");
		this.printelem.id = "printelem";
		this._container = document.createElement("div");
		container.style.width = "200";
		container.style.height = "100"
		this._container.appendChild(this.button);
		container.appendChild(this._container);
		container.appendChild(this.printelem);

	}



	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if(context.parameters.DataToPrint.raw)
		{
			this.printable = context.parameters.DataToPrint.raw;
		}
	}
	private onButtonClick(event: Event): void {
		var testss = JSON.parse(this.printable);
        var col = [];
        for (var i = 0; i < testss.length; i++) {
            for (var key in testss[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
		this.tr = this.table.insertRow(-1);                  
        for (var i = 0; i < col.length; i++) {
            this.th = document.createElement("th");   
            this.th.innerHTML = col[i];
            this.tr.appendChild(this.th);
        }
        for (var i = 0; i < testss.length; i++) {
            this.tr = this.table.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                this.tabCell = this.tr.insertCell(-1);
                this.tabCell.innerHTML = testss[i][col[j]];
            }
		}
		this.printelem.appendChild(this.table);
		let printContents, popupWin;
		var abcd = document.getElementById("printelem");
		if(abcd)
		{
			printContents = abcd.innerHTML;
		}
    	popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
		if(popupWin)
		{
			popupWin.document.open();
			popupWin.document.write(`
			<html>
				<head>
				<title>Print tab</title>
				<style>
				</style>
				</head>
			<body onload="window.print();window.close()">${printContents}</body>
			</html>`
			);
			var cleartable = document.getElementById("table");
			if(cleartable){cleartable.innerHTML = ""};
			popupWin.document.close();			
	}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
	}
}