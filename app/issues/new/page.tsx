'use client';

import { Button, Callout, Text, TextField } from '@radix-ui/themes';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { createIssueSchema } from '@/app/createIssueSchema';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

type IssueForm = z.infer<typeof createIssueSchema>;

// interface IssueForm {
//   title: string;
//   description: string;
// }

const NewIssuePage = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      await axios.post('/api/issues', data);
      router.push('/issues');
    } catch (error) {
      setSubmitting(false);
      console.log(error);
      setError('An unexpected error occurred');
    }
  });

  return (
    <div className='max-w-xl'>
      {error && (
        <Callout.Root color='red' className='mb-3'>
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className=' space-y-3' onSubmit={onSubmit}>
        <TextField.Root placeholder='Title' {...register('title')} />
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder='Description' {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        <Button disabled={isSubmitting}>
          Submit New Issue {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
