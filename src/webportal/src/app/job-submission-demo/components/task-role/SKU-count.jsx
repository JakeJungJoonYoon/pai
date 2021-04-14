// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import PropTypes from 'prop-types';
import { FormSpinButton } from '../controls/form-spin-button';

const SKU_COUNT_MIN = 0;

export const SKUCount = ({ value, onChange }) => {
  const onItemChange = val => {
    onChange('hivedSku', { ...value, skuNum: val });
  };

  return (
    <FormSpinButton
      min={SKU_COUNT_MIN}
      step={1}
      value={value.skuNum}
      onChange={onItemChange}
    />
  );
};

SKUCount.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
