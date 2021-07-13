import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { XyzComponent } from './components/xyz/xyz.component';
import { AbcComponent } from './components/abc/abc.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent, CustomSnackBarComponentLogin } from './components/login/login.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from './components/header/header.component';
import {MatInputModule, MatProgressSpinnerModule, MatDatepickerModule, MatNativeDateModule, MatSnackBarModule, MAT_CHIPS_DEFAULT_OPTIONS} from '@angular/material';
import { RegisterComponent, CustomSnackBarComponentRegister } from './components/register/register.component';
import {MatRadioModule} from '@angular/material/radio';
import { MenuComponent } from './components/menu/menu.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AlertComponent } from './components/alert/alert.component';
import { environment } from 'src/environments/environment';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ClipboardModule } from 'ngx-clipboard';
import {MatChipsModule} from '@angular/material/chips'
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';

import { ChartsModule, ThemeService  } from 'ng2-charts';

import { AngularFireModule } from '@angular/fire';
import {AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { AddFilesComponent, CustomSnackBarComponentAddFilesChatbot } from './dialogs/add-files/add-files.component';
import { RouteGuardGuard } from './guardians/route-guard/route-guard.guard';
import { LoginRegisterGuard } from './guardians/loginRegister/login-register.guard';
import { ValidateUsersComponent } from './components/validate-users/validate-users.component';
import { AdminGuardianGuard } from './guardians/admin-guardian/admin-guardian.guard';
import { UsersLessonsComponent, CustomSnackBarComponentUserLessonsAddStudent } from './components/users-lessons/users-lessons.component';
import { LessonsComponent } from './components/lessons/lessons.component';
import { AddSubjectComponent } from './dialogs/add-subject/add-subject.component';
import { AddStudentComponent } from './dialogs/add-student/add-student.component';
import { ScoresComponent,CustomSnackBarComponentAddScore } from './components/scores/scores.component';
import { ScoreUserComponent } from './dialogs/score-user/score-user.component';
import { GeneralFilesComponent, CustomSnackBarComponentSendGeneralFile } from './components/general-files/general-files.component';
import { RemindersComponent, CustomSnackBarComponent } from './components/reminders/reminders.component';
import { GenerateKeyComponent } from './dialogs/generate-key/generate-key.component';
import { ConfigureAccountComponent, CustomSnackBarComponentUpdatePassword } from './components/configure-account/configure-account.component';
import { ClassGComponent, CustomSnackBarComponentUserLessonsAddLesson } from './components/class-g/class-g.component';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ViewReminderComponent } from './dialogs/view-reminder/view-reminder.component';
import { ProgressGroupComponent } from './components/progress-group/progress-group.component';
import { GeneralProgressComponent } from './components/graphics/general-progress/general-progress.component';
import { PassFailComponent } from './components/graphics/pass-fail/pass-fail.component';
import { RatingPercentagesComponent } from './components/graphics/rating-percentages/rating-percentages.component';
import { IndividualProgressComponent } from './components/graphics/individual-progress/individual-progress.component';
import { ProgressStudentComponent } from './components/progress-student/progress-student.component';
import { GeneralProgressStudentComponent } from './components/graphics/general-progress-student/general-progress-student.component';
import { PushNotificationService } from './services/push-notification.service';
import { AddHomeworkComponent } from './dialogs/add-homework/add-homework.component';
import { HomeworksComponent } from './components/homeworks/homeworks.component';
import { ViewDetailsHomeworksComponent } from './dialogs/view-details-homeworks/view-details-homeworks.component';
import { FeedbackHomeworkComponent } from './dialogs/feedback-homework/feedback-homework.component';
import { HomeworksStudentComponent } from './components/homeworks-student/homeworks-student.component';
import { FeelingStudentsComponent } from './components/feeling-students/feeling-students.component';
import { FeelingGroupComponent } from './components/feelings/feeling-group/feeling-group.component';
import { FeelingIndividualComponent } from './components/feelings/feeling-individual/feeling-individual.component';
import { AddAdviceWComponent } from './dialogs/add-advice-w/add-advice-w.component';
import { DoubtsComponent } from './components/Doubts/doubts/doubts.component';
import { MaterialDoubtsComponent } from './components/Doubts/material-doubts/material-doubts.component';
import { HomeworkDoubtsComponent } from './components/Doubts/homework-doubts/homework-doubts.component';
import { DetailsDoubtComponent } from './dialogs/details-doubt/details-doubt.component';
import { ExamDoubtsComponent } from './components/Doubts/exam-doubts/exam-doubts.component';
import { GeneralDoubtsComponent } from './components/Doubts/general-doubts/general-doubts.component';

/**
 * Variable para importar todas las librerias de angular material
 */
const angularMaterial=[
  MatSlideToggleModule,
  MatCheckboxModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatInputModule,
  MatIconModule,
  MatRadioModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTableModule,
  MatPaginatorModule,
  MatSnackBarModule, 
  MatExpansionModule,
]
@NgModule({
  declarations: [
    AppComponent,
    XyzComponent,
    AbcComponent,
    LoginComponent,
    HeaderComponent,
    RegisterComponent,
    MenuComponent,
    ChatbotComponent,
    AlertComponent,
    AddFilesComponent,
    AddHomeworkComponent,
    ValidateUsersComponent,
    UsersLessonsComponent,
    LessonsComponent,
    AddSubjectComponent,
    AddStudentComponent,
    ScoresComponent,
    ScoreUserComponent,
    ViewDetailsHomeworksComponent,
    GeneralFilesComponent,
    RemindersComponent,
    GenerateKeyComponent,
    CustomSnackBarComponent,
    CustomSnackBarComponentUserLessonsAddLesson,
    CustomSnackBarComponentUserLessonsAddStudent,
    CustomSnackBarComponentRegister,
    CustomSnackBarComponentSendGeneralFile,
    CustomSnackBarComponentAddFilesChatbot,
    CustomSnackBarComponentAddScore,
    CustomSnackBarComponentLogin,
    ConfigureAccountComponent,
    ClassGComponent,
    ViewReminderComponent,
    CustomSnackBarComponentUpdatePassword,
    ProgressGroupComponent,
    GeneralProgressComponent,
    PassFailComponent,
    RatingPercentagesComponent,
    IndividualProgressComponent,
    ProgressStudentComponent,
    GeneralProgressStudentComponent,
    AddHomeworkComponent,
    HomeworksComponent,
    ViewDetailsHomeworksComponent,
    FeedbackHomeworkComponent,
    DetailsDoubtComponent,
    HomeworksStudentComponent,
    FeelingStudentsComponent,
    FeelingGroupComponent,
    FeelingIndividualComponent,
    AddAdviceWComponent,
    DoubtsComponent,
    MaterialDoubtsComponent,
    HomeworkDoubtsComponent,
    DetailsDoubtComponent,
    ExamDoubtsComponent,
    GeneralDoubtsComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    angularMaterial,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    ClipboardModule,
    MatChipsModule,
    MatTabsModule,
    ChartsModule,
  ],
  providers: [RouteGuardGuard, PushNotificationService, LoginRegisterGuard, MatDatepickerModule, AdminGuardianGuard,ThemeService,{
    provide: MAT_CHIPS_DEFAULT_OPTIONS,
    useValue: {
      separatorKeyCodes: [ENTER, COMMA]
    }
  },{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  
  bootstrap: [AppComponent],
  entryComponents: [AlertComponent,AddFilesComponent, AddHomeworkComponent,AddSubjectComponent, 
    AddStudentComponent, ScoreUserComponent, ViewDetailsHomeworksComponent, FeedbackHomeworkComponent, GenerateKeyComponent, CustomSnackBarComponent,
    CustomSnackBarComponentUserLessonsAddLesson, CustomSnackBarComponentUserLessonsAddStudent,
    CustomSnackBarComponentRegister,CustomSnackBarComponentSendGeneralFile,
    CustomSnackBarComponentAddFilesChatbot,CustomSnackBarComponentAddScore,
    CustomSnackBarComponentLogin,ViewReminderComponent, CustomSnackBarComponentUpdatePassword, AddAdviceWComponent,DetailsDoubtComponent
  ]
})
export class AppModule { }
