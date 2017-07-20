import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import * as SurveyEditor from 'surveyjs-editor';
import * as Survey from 'survey-angular';

@Component({
  selector: 'app-editor-survey',
  templateUrl: './editor-survey.component.html',
  styleUrls: ['./editor-survey.component.css']
})
export class EditorSurveyComponent implements OnInit {

  constructor() { }

    editor: SurveyEditor.SurveyEditor;
    @Input() json: any;
    @Output() surveySaved: EventEmitter<Object> = new EventEmitter();
    ngOnInit() {

        let editorOptions = {
            questionTypes : ["text", "checkbox", "radiogroup", "dropdown"],
            showEmbededSurveyTab: false,
            showJSONEditorTab : false,
            generateValidJSON : true,
            designerHeight: "auto"
            };
    
        //Add custom button in the toolbar
    
        this.editor = new SurveyEditor.SurveyEditor('surveyEditorContainer', editorOptions);
        this.editor.text = JSON.stringify(this.json);
        this.editor.saveSurveyFunc = this.saveMySurvey;

    }

    saveMySurvey = () => {
        console.log(this.editor.text);
        this.surveySaved.emit(JSON.parse(this.editor.text));
    }
}
