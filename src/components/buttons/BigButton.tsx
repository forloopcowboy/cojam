import classNames from '../../utils/class-names.ts';

function BigButton(props: { className?: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={props.onClick}
      className={classNames(
        'rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700',
        props.className,
      )}
    >
      {props.children}
    </button>
  );
}

export default BigButton;
