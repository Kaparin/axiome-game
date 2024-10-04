import { TestBed } from '@angular/core/testing';

import { PlayerStateServiceService } from './player-state.service';

describe('PlayerStateServiceService', () => {
  let service: PlayerStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
