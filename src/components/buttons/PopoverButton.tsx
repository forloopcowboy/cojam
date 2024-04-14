import { Fragment, ReactNode } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Float } from '@headlessui-float/react';
import { Placement } from '@floating-ui/react';
import classNames from '../../utils/class-names.ts';

export interface Props {
  button?: ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  buttonClassName?: string;
  placement?: Placement;
  autoPlacement?: boolean;
  portal?: boolean;
  flip?: boolean;
  disabled?: boolean;
}

export function PopoverButton(props: Props): JSX.Element {
  return (
    <Popover as={Fragment}>
      <Float
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        placement={props.placement ?? 'bottom'}
        autoPlacement={props.autoPlacement}
        portal={props.portal}
        flip={props.flip}
      >
        <Popover.Button className={props.className} disabled={props.disabled}>
          {props.button}
        </Popover.Button>
        <Transition as={Fragment}>
          <Popover.Panel
            as="div"
            className={classNames(
              'm-1 overflow-auto rounded-md border-2 border-gray-800 px-3 py-2 shadow-xl',
              props.panelClassName,
            )}
          >
            {props.children}
          </Popover.Panel>
        </Transition>
      </Float>
    </Popover>
  );
}
