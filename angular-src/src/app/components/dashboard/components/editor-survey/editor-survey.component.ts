import { OnInit, Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'toastr-ng2'
import * as SurveyEditor from 'surveyjs-editor';
import * as Survey from 'survey-angular';

@Component({
  selector: 'app-editor-survey',
  templateUrl: './editor-survey.component.html',
  styleUrls: ['./editor-survey.component.css']
})
export class EditorSurveyComponent implements OnInit {

  constructor(
      private toastr : ToastrService
  ) { }

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
        if (this.surveyValide(this.editor.text)){
            this.surveySaved.emit(JSON.parse(this.editor.text));
            this.toastr.success("Survey saved")
        }
        else
            this.toastr.info("The Survey is empty")
    }

    surveyValide(text){
        var pages = JSON.parse(text)
        var valide = false;

        for (var page in pages ){
            for ( var ele in pages[page] )
                if (pages[page][ele]["elements"]){
                valide = true;
            }
        }
        return valide;
    }
}
