import { ListInput } from '../components/ListInput.tsx';
import _ from 'lodash';
import { allSubdivisionTypes, SubdivisionType } from './Subdivisions.ts';
import classNames from '../utils/class-names.ts';
import { Subdivision } from 'tone/build/esm/core/type/Units';

function SubdivisionPicker({
  value: stepInterval,
  onChange: setStepInterval,
  options = allSubdivisionTypes,
}: {
  value: Subdivision;
  onChange: (stepInterval: Subdivision) => void;
  options?: SubdivisionType[];
}) {
  return (
    <div className="w-fit rounded-lg border border-gray-800">
      <ListInput
        valueKey="value"
        value={[{ value: stepInterval }]}
        onChange={(elems) => {
          const last = _.last(elems);
          if (last) {
            setStepInterval(last.value);
          }
        }}
        options={options}
        ListItem={(s) => (
          <div
            className={classNames(
              'w-full rounded-md p-2 text-white',
              s.isOption && s.selected && 'bg-blue-500',
              s.isOption && s.active && 'bg-blue-400',
              !s.isOption && 'w-fit bg-gray-800',
            )}
          >
            {s.item.value}
          </div>
        )}
      />
    </div>
  );
}

export default SubdivisionPicker;
