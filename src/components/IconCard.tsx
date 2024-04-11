import { GenericComponentProps } from '../utils/GenericComponents.ts';
import { ElementType, ExoticComponent, ReactNode } from 'react';
import classNames from '../utils/class-names.ts';
import { Link } from 'react-router-dom';

function IconCard<E extends ElementType | ExoticComponent>(
  props: {
    className?: string;
    icon: React.ReactNode;
    title: React.ReactNode;
    children?: ReactNode;
  } & GenericComponentProps<E>,
) {
  const Card = props.as ?? 'div';
  const { className, icon, title, children, ...rest } = props;

  return (
    <Card
      {...rest}
      className={classNames(
        'flex flex-col items-center gap-2 rounded-lg bg-gray-800 p-5 text-gray-300',
        Card === 'button' || (Card === Link && 'cursor-pointer hover:bg-gray-900'),
        className,
      )}
    >
      <div className="grow">{icon}</div>
      <h1 className="text-lg font-semibold">{title}</h1>
      {children}
    </Card>
  );
}

export default IconCard;
