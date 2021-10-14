import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CurbsidePickupPage } from './curbside-pickup.page';

describe('CurbsidePickupPage', () => {
  let component: CurbsidePickupPage;
  let fixture: ComponentFixture<CurbsidePickupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurbsidePickupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CurbsidePickupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
