// STAB_UNKNOWN
export const transitions = {
  basic: {
    enter: 'ease-out duration-300',
    enterFrom: 'opacity-0 scale-80 sm:scale-95',
    enterTo: 'opacity-100 scale-100',
    leave: 'ease-in duration-200',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-80 sm:scale-95',
  },
  fadeSlow: {
    enter: 'ease-out duration-2000',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'ease-in duration-2000',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  },
  popFromBelow: {
    enter: 'ease-in duration-300',
    enterFrom: 'opacity-0 scale-50 translate-y-1.5 sm:scale-95',
    enterTo: 'opacity-100 scale-100 translate-y-0',
    leave: 'ease-in duration-200',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-80 sm:scale-95',
  },
  popFromBelowFast: {
    enter: 'ease-in duration-100',
    enterFrom: 'opacity-0 scale-50 translate-y-1.5 sm:scale-95',
    enterTo: 'opacity-100 scale-100 translate-y-0',
    leave: 'ease-in duration-100',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-80 sm:scale-95',
  },
};
