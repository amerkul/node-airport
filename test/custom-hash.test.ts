import {CustomSha256Hash} from '../src/com/solvd/airport/crypto/custom-hash';

const hash = new CustomSha256Hash();

test('Uint8Array', () => {
    expect(hash.update('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiYW5uYSIsInJvbGUiOiJhZG1pbiIsImlzcyI6IjE2OTc2MzU3MTU4NDgiLCJleHAiOiIxNjk3NjM2MDE1ODQ4In0=secret').digest('hex'))
    .toBe('e4e09e83e5736b8372c6dffe726120a5d623df7eae1a20eda12d4535c9b5bb15');
});
